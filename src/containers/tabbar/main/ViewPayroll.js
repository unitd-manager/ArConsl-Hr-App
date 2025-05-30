import { View, StyleSheet, ScrollView, PermissionsAndroid, Platform,Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import EText from '../../../components/common/EText';
import { styles } from '../../../themes';
import { Dropdown } from 'react-native-element-dropdown';
import { Year, Month } from '../../../api/constant';
import moment from 'moment';
import { getHeight, moderateScale } from '../../../common/constants';
import EButton from '../../../components/common/EButton';
import { StackNav } from '../../../navigation/NavigationKeys';
import { useNavigation } from '@react-navigation/native';
import api from '../../../api/api';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

// import PdfHeader from './PdfHeader';



const ViewPayroll = () => {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 12 : currentMonth;
  const formattedPrevMonth = Month.find(m => parseInt(m.value) === previousMonth)?.value || '';

  const [month, setMonth] = useState(formattedPrevMonth);
  const [year, setYear] = useState(currentYear.toString());
  const [payslip, setPayslip] = useState('');
  const [user, setUserData] = useState();

  const onChangedMonth = text => setMonth(text.value.toLowerCase());
  const onChangedYear = text => setYear(text.value.toLowerCase());

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };



  useEffect(() => {
    getUser();
  }, []);

  const onPressContinue = async () => {
    if (month && year) {
      try {
        const response = await api.post('/payrollmanagement/getpayrollbyMonthYear', {
          payroll_month: month,
          payroll_year: year,
          employee_id: user?.employee_id
        });
  
        if (response.data?.data?.length > 0) {
          setPayslip(response.data.data[0]); // Update the state first
        } else {
          alert("No data found for the selected month and year.");
        }
      } catch (error) {
        alert('Network connection error.');
        console.error('API Error:', error);
      }
    } else {
      alert("Please select both month and year.");
    }
  };


  useEffect(() => {
    if (payslip) {
      generatePDF(payslip);
    }
  }, [payslip]); // This will run when payslip state is updated
  
  

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.Version >= 30) {
        Alert.alert(
          'Permission Required',
          'To save payslips, please enable "All Files Access" in settings.',
          [{ text: 'OK', onPress: () => RNFetchBlob.android.actionViewIntent('package:' + 'your.package.name') }]
        );
        return false; // Cannot request MANAGE_EXTERNAL_STORAGE programmatically
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to storage to save the payslip.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };
  


  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    return dateString.split('T')[0]; 
  };
  
  const formattedDate = formatDate(payslip?.generated_date);
  

  const generatePDF = async (payslipData) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      alert('Storage permission denied');
      return;
    }



  // Compute the grossPay and grossPay1 dynamically
  const basicPay = parseFloat(payslipData?.basic_pay) || 0;
  const reimbursement = parseFloat(payslipData?.reimbursement) || 0;

  const directorFee = parseFloat(payslipData?.director_fee) || 0;

  const allowances = [
    payslipData?.allowance1,
    payslipData?.allowance2,
    payslipData?.allowance3,
    payslipData?.allowance4,
    payslipData?.allowance5,
  
  ].reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  
  const deductions = [
    payslipData?.deduction1,
    payslipData?.deduction2,
    payslipData?.deduction3,
    payslipData?.deduction4,
    payslipData?.sdl,
    payslipData?.loan_amount,
    payslipData?.income_tax_amount,
    payslipData?.pay_cdac,
    payslipData?.cpf_employee,
  ].reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

  const grossPayCalc = basicPay + allowances;
  const grossPay1Calc = deductions;
  const netPayCalc = reimbursement + directorFee + grossPayCalc - grossPay1Calc;
  // const allowance1 = parseFloat(payslipData?.allowance1) || 0;

  // console.log("Allowance1 Value:", allowance1,payslipData?.logo_code);
  const addressParts = [
    payslipData?.address_flat,
    payslipData?.address_street,
    payslipData?.address_state,
    payslipData?.address_town
  ].filter(Boolean).join(', '); // Removes null/undefined values


  const { getName } = require('country-list');

const countryName = getName(payslipData?.address_country) || payslipData?.address_country;
const countryPostal = [countryName, payslipData?.address_po_code].filter(Boolean).join(' - ');


  
  const BranchTitle = payslipData?.branch_title || '';

  let base64Image = '';

  try {
    base64Image = `${payslipData?.logo_code}`;
  } catch (error) {
    console.error('Error loading image:', error);
  }
  const date = new Date();

  const timestamp = date.getTime();

    try {
      const pdfOptions = {
        html: `
        <style>
    table {
      width: 100%;
      font-size: 12px;
    }
    th, td {
      padding: 5px;
      border: none;
    }
    th {
      background-color: #eaf2f5;
      color:rgb(7, 6, 6);
      font-weight: bold;
      text-align: center;
    }
    td {
      text-align: left;
    }
    .highlight {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .title {
      font-size: 15px;
      font-weight: bold;
            text-align: center;
      background-color: #eaf2f5;;
    }
  </style>
       


         <table width="100%" style="font-size:12px;">
    <tr>
        <td>
            <img src="data:image/png;base64,${base64Image}" style="width: 200px; height: auto;" />
        </td>
        <td align="center" style="font-weight: bold;">
            <div style="font-size:35px; font-weight:bold;">
                 ${BranchTitle}
            </div>
          <div style="font-size:20px;">
  ${addressParts} <br> ${countryPostal}
</div>

        </td>
        <td></td>
    </tr>
    <tr><td></td><td></td><td></td></tr>
</table>


         <table  style="font-size:12px;">
          <tr>
                <td></td>
            </tr>
          
            <tr>
          
                <td align="center" class="title">Payslip</td>
            </tr>
             <tr>
                <td></td>
            </tr>
              <tr>
                <td></td>
            </tr>
              <tr>
                <td></td>
            </tr>
            <tr style="background-color: #eaf2f5; ">
                <td style="font-weight:bold;"> Name Of Employee</td>
            </tr>
            <tr>
                <td> ${payslip?.employee_name}</td>
            </tr>
             <tr>
                <td></td>
            </tr>
              <tr style="background-color: #eaf2f5; ">
                <td style="font-weight:bold;"> Nric No</td>
            </tr>
            <tr><td>${payslip?.nric_no}</td></tr>
            <tr>
                <td></td>
            </tr>
        </table>
             <table  style="font-size:12px;">
            <tr>
                <td  style="background-color: #eaf2f5; ; font-weight:bold;"> Item</td>
                <td  style="background-color: #eaf2f5; ; font-weight:bold;"> Amount (S$)</td>
                <td  style="background-color: #eaf2f5; ; font-weight:bold;"></td>
            </tr>
            <tr>
                <td> Basic Pay</td>
                <td style="background-color: #f5f5f5;">${payslip?.basic_pay}</td>
                <td   align="center" style=" background-color: #f5f5f5; ">(A)</td>
            </tr>
          
            <tr>
                <td> Total Allowance <br> (Breakdown shown below)</td>
                <td style="background-color: #f5f5f5;">${grossPayCalc.toFixed(2)}</td>
                <td   align="center" style="background-color: #f5f5f5; ">(B)</td>
            </tr>
             <tr>
                <td>Transport</td>
                <td style="background-color: #f5f5f5;">${payslip?.allowance1 ? payslip.allowance1 : '0'}</td>
                <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
              <tr>
                <td>Entertainment</td>
                <td style="background-color: #f5f5f5;">${payslip?.allowance2 ? payslip.allowance2 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td>Food</td>
                <td style="background-color: #f5f5f5;">${payslip?.allowance3 ? payslip.allowance3 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
              <tr>
                <td>Shift Allowance</td>
                <td style="background-color: #f5f5f5;">${payslip?.allowance4 ? payslip.allowance4 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td>Others</td>
                <td style="background-color: #f5f5f5;">${payslip?.allowance5 ? payslip.allowance5 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td>Total Deductions <br> (Breakdown shown below)</td>
                <td style="background-color: #f5f5f5;">${grossPay1Calc.toFixed(2)}</td>
                <td   align="center" style=" background-color: #f5f5f5; ">(C)</td>
            </tr>
            <tr>
                <td> Employees CPF deduction</td>
                <td style="background-color: #f5f5f5;"> ${payslip?.cpf_employee}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
              <tr>
                <td>Sdl</td>
                <td style="background-color: #f5f5f5;">${payslip?.sdl ? payslip.sdl : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
              <tr>
                <td >Advanced Loan</td>
                <td style="background-color: #f5f5f5;">${payslip?.loan_amount ? payslip.loan_amount : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td >Housing</td>
                <td style="background-color: #f5f5f5;">${payslip?.deduction1 ? payslip.deduction1 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td>Transportaion</td>
                <td style="background-color: #f5f5f5;">${payslip?.deduction2 ? payslip.deduction2 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td >Others</td>
                <td style="background-color: #f5f5f5;">${payslip?.deduction3 ? payslip.deduction3 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td >Food</td>
                <td style="background-color: #f5f5f5;">${payslip?.deduction4 ? payslip.deduction4 : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
       
            <tr style="background-color: #eaf2f5;">
           
                    <td  style="font-weight:bold;">Date Of Payment</td>
               
               <td></td>
               <td></td>
            </tr>
              <tr>
                <td></td>
            </tr>
            <tr>
                
                    <td>${formattedDate}</td>
              
            </tr>
              <tr>
                <td></td>
            </tr>
               <tr style="background-color: #eaf2f5;">
           
                    <td style="font-weight:bold;">Mode Of Payment</td>
               <td></td>
               <td></td>
            </tr>
              <tr>
                <td></td>
            </tr>
             <tr>
                
              <td>${payslip?.mode_of_payment ? payslip.mode_of_payment : ''}</td>
              
            </tr>
              <tr>
                <td></td>
            </tr>
            <tr style="background-color: #eaf2f5; ">
                <td> Overtime Details*</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td> Overtime Payment Period(s)</td>
                <td style="background-color: #f5f5f5; ">${
                  moment(payslip.payslip_start_date).format('DD-MM-YYYY')
                    ? moment(payslip.payslip_start_date).format('DD-MM-YYYY')
                    : ''
                }   TO   ${
                  moment(payslip.payslip_end_date).format('DD-MM-YYYY')
                    ? moment(payslip.payslip_end_date).format('DD-MM-YYYY')
                    : ''
                }</td>
                <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td   > Overtime Hours Worked</td>
                <td style="background-color: #f5f5f5;">${payslip?.ot_hours ? payslip.ot_hours :'0'}</td>
                <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td > Total Overtime Pay</td>
                <td style="background-color: #f5f5f5;"> ${payslip?.ot_amount ? payslip.ot_amount : '0'}</td>
                <td   align="center" style=" background-color: #f5f5f5; "> (D) </td>
            </tr>
              <tr>
                <td ></td>
                <td ></td>
                 <td></td>
            </tr>
            <tr>
                <td  style="background-color: #eaf2f5;"> Item</td>
                <td  style="background-color: #eaf2f5;"> Amount (S$)</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td  height="40px" > Other Additional Payment (Breakdown shown below)<br/>&nbsp;Reimbursement<br/>&nbsp;Director Fee</td>
                <td style="background-color: #f5f5f5; " height="40px">${payslip?.reimbursement ? payslip.reimbursement : '0'}<br/>${payslip?.director_fee ? payslip.director_fee : '0'}</td>
                <td  height="40px" align="center" style=" background-color: #f5f5f5; "> (E) </td>
            </tr>
            <tr>
                <td> Net Pay</td>
                <td style="background-color: #f5f5f5; ">${netPayCalc.toFixed(2)}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td height="15px"></td>
            </tr>
            <tr style="background-color: #eaf2f5; ">
                <td colspan="3" style="font-weight:bold;"> CPF Details</td>
            </tr>
            <tr>
                <td > Employer Contribution</td>
                <td style="background-color: #f5f5f5; "> ${payslip?.cpf_employer ? payslip.cpf_employer : '0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
            <tr>
                <td > Employee Contribution</td>
                <td style="background-color: #f5f5f5; " >${payslip?.cpf_employee ? payslip.cpf_employee :'0'}</td>
                 <td   align="center" style="background-color: #f5f5f5; "></td>
            </tr>
              <tr>
                <td></td>
            </tr>
              <tr>
                <td></td>
            </tr>
        <tr><td></td><td></td></tr>
          <tr><td></td><td></td></tr>
 <tr><td></td><td></td></tr>
  <tr><td></td><td></td></tr>
        <tr>
        <td width="30%" style="border-top:1px solid black;">Signature Of Employee</td>
        </tr>
         <tr><td></td><td></td></tr>
          <tr><td></td><td></td></tr>
 <tr><td></td><td></td></tr>
  <tr><td></td><td></td></tr>
                  <tr>
        <td ></td>
        <td > PAYSLIP CREATED</td>
        <td ></td>
        </tr>
        </table>
       
         
        `,
        fileName: `payslip_${month}_${year}_${timestamp}`,
        directory: Platform.OS === 'android' ? RNFetchBlob.fs.dirs.DownloadDir : 'Documents',
      };
  
      const file = await RNHTMLtoPDF.convert(pdfOptions);
      alert(`Payslip saved to: ${file.filePath}`);
  
      if (Platform.OS === 'android') {
        RNFetchBlob.android.actionViewIntent(file.filePath, 'application/pdf');
      }
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF.');
    }
  };
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Convert month number to name (assuming `month` is a number)
  const monthName = monthNames[parseInt(month) - 1];

  return (
    <>
      <EHeader title={'Payslip'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={localStyles.contentContainerStyle}>
          <EText type="b20" numberOfLines={1} color={colors.textcolor}>
            Generate Your Payslip Here
          </EText>

          {/* <Dropdown
            style={[
              localStyles.dropdownStyle,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.backgroundColor,
              },
            ]}
            placeholderStyle={{ color: colors.grayScale5 }}
            selectedTextStyle={{ color: '#000000' }}
            itemTextStyle={{ color: '#000000' }}
            data={Month}
            maxHeight={moderateScale(180)}
            labelField="label"
            valueField="value"
            placeholder="Month"
            value={month}
            onChange={onChangedMonth}
          />

          <Dropdown
            style={[
              localStyles.dropdownStyle,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.backgroundColor,
              },
            ]}
            placeholderStyle={{ color: colors.grayScale5 }}
            selectedTextStyle={{ color: '#000000' }}
            itemTextStyle={{ color: '#000000' }}
            data={[
              { label: currentYear.toString(), value: currentYear.toString() },
              { label: previousYear.toString(), value: previousYear.toString() }
            ]}
            maxHeight={moderateScale(180)}
            labelField="label"
            valueField="value"
            placeholder="Year"
            value={year}
            onChange={onChangedYear}
          /> */}


            {/* Non-editable Month Display */}
        <View style={[localStyles.dropdownStyle, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.backgroundColor, 
          paddingVertical: moderateScale(10), 
          paddingHorizontal: moderateScale(12),
          borderRadius: moderateScale(5)
        }]}>
          <EText type="m16" color={'#000000'}>{monthName}</EText>
        </View>

        {/* Non-editable Year Display */}
        <View style={[localStyles.dropdownStyle, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.backgroundColor, 
          paddingVertical: moderateScale(10), 
          paddingHorizontal: moderateScale(12),
          borderRadius: moderateScale(5)
        }]}>
          <EText type="m16" color={'#000000'}>{year}</EText>
        </View>

          
          
        </View>
        <EButton
        type={'S16'}
        title={'View Last Month Payslip'}
        color={colors.white}
        onPress={onPressContinue}
        containerStyle={localStyles.continueBtnStyle}
      />
      </ScrollView>

     
    </>
  );
};

export default ViewPayroll;

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph25,
    ...styles.pv20,
  },
  dropdownStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph25,
    ...styles.mv15,
    color: '#000000',
  },
  continueBtnStyle: {
    ...styles.mh20,
    ...styles.mv10,
  },
});

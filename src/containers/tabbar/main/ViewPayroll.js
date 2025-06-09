import { View, StyleSheet, ScrollView, PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
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
import { requestStoragePermission, ensureDownloadDirectory } from './utils';

// import PdfHeader from './PdfHeader';



const ViewPayroll = () => {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);
  const [pdfFilePath, setPdfFilePath] = useState(null);

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
    const generatePayslipPDF = async () => {
      if (payslip) {
        try {
          await generatePDF(payslip);
        } catch (error) {
          console.error('Error generating PDF:', error);
          Alert.alert('Error', 'Failed to generate PDF. Please try again.');
        }
      }
    };
    generatePayslipPDF();
  }, [payslip]); // This will run when payslip state is updated
  
  



  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    return dateString.split('T')[0]; 
  };
  
  const formattedDate = formatDate(payslip?.generated_date);
  
  const generatePDF = async (payslipData) => {
    try {
      console.log('Starting PDF generation process...');

      if (!payslipData) {
        throw new Error('No payslip data available');
      }

      // Request storage permission for Android
      const permission = await requestStoragePermission();
      if (!permission) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to save your payslip PDF.',
          [
            { text: 'Cancel' },
            {
              text: 'Grant Permission',
              onPress: async () => {
                const newPermission = await requestStoragePermission();
                if (newPermission) {
                  generatePDF(payslipData);
                }
              }
            }
          ]
        );
        return;
      }

      // Create a proper file name with month name for better readability
      const timestamp = Date.now();
      const currentMonthName = monthNames[parseInt(month) - 1];
      const fileName = `payslip_${currentMonthName}_${year}_${timestamp}.pdf`;
      
      // Get the appropriate directory
      let directory;
      if (Platform.OS === 'android') {
        // Use the Downloads directory for Android
        directory = RNFetchBlob.fs.dirs.DownloadDir;
      } else {
        // Use documents directory for iOS
        directory = RNFetchBlob.fs.dirs.DocumentDir;
      }
      
      // Create Payslips directory if it doesn't exist
      const dirPath = `${directory}/Payslips`;
      const exists = await RNFetchBlob.fs.exists(dirPath);
      if (!exists) {
        await RNFetchBlob.fs.mkdir(dirPath);
      }

      const filePath = `${dirPath}/${fileName}`;
      console.log('Will save PDF to:', filePath);

      // Calculate values for the PDF
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

      const options = {
        html: `
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica'; padding: 20px; }
                table { width: 100%; font-size: 12px; border-collapse: collapse; }
                th, td { padding: 5px; border: none; }
                th { background-color: #eaf2f5; color: rgb(7, 6, 6); font-weight: bold; text-align: center; }
                td { text-align: left; }
                .highlight { background-color: #f5f5f5; font-weight: bold; }
                .title { font-size: 15px; font-weight: bold; text-align: center; background-color: #eaf2f5; }
              </style>
            </head>
            <body>
              <table width="100%" style="font-size:12px;">
    <tr>
        <td>
        </td>
        <td align="center" style="font-weight: bold;">
            <div style="font-size:35px; font-weight:bold;">
                
            </div>
          <div style="font-size:20px;">
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
            <td style="background-color: #f5f5f5;">
  ${(Number.isNaN(grossPayCalc) || grossPayCalc == null) ? '0.00' : grossPayCalc.toFixed(2)}
</td>

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
        fileName: fileName,
        directory: dirPath,
        base64: false,
        height: 842, // A4 height in points
        width: 595,  // A4 width in points
        padding: 20,
      };

      console.log('Converting HTML to PDF with options:', { fileName, directory: dirPath });
      
      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF generation result:', file);

      if (!file?.filePath) {
        throw new Error('PDF generation failed - no file path returned');
      }

      // For Android, we need to copy the file to the downloads directory to make it visible
      if (Platform.OS === 'android') {
        try {
          // Copy file to downloads
          await RNFetchBlob.fs.cp(file.filePath, filePath);
          
          // Make the file visible in Downloads
          await RNFetchBlob.android.addCompleteDownload({
            title: fileName,
            description: 'Payslip PDF file',
            mime: 'application/pdf',
            path: filePath,
            showNotification: true,
          });

          // Update the pdfFilePath state with the new location
          setPdfFilePath(filePath);
        } catch (error) {
          console.error('Error making file accessible:', error);
          throw new Error('Could not save file to downloads');
        }
      } else {
        setPdfFilePath(file.filePath);
      }

      // Show success message with file location
      Alert.alert(
        'Success',
        Platform.OS === 'android' 
          ? `PDF has been saved to Downloads/Payslips/${fileName}`
          : 'PDF has been generated successfully',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('PDF Generation Error:', error);
      setPdfFilePath(null);
      Alert.alert(
        'Error',
        'Could not generate PDF: ' + error.message,
        [
          { text: 'Retry', onPress: () => generatePDF(payslipData) },
          { text: 'Cancel' }
        ]
      );
    }
  };



  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Convert month number to name (assuming `month` is a number)
  const monthName = monthNames[parseInt(month) - 1];  const handleViewPDF = async () => {
    if (!pdfFilePath) {
      Alert.alert('Error', 'No PDF file available. Please generate the payslip first.');
      return;
    }

    try {
      if (Platform.OS === 'android') {
        const cleanPath = pdfFilePath.startsWith('file://')
          ? pdfFilePath.substring(7)
          : pdfFilePath;

        console.log('Attempting to open PDF at path:', cleanPath);

        try {
          // First try using the content provider approach
          const fileExists = await RNFetchBlob.fs.exists(cleanPath);
          if (!fileExists) {
            throw new Error('PDF file not found');
          }

          // Try to open with default PDF viewer
          await RNFetchBlob.android.actionViewIntent(
            cleanPath,
            'application/pdf'
          );
        } catch (error) {
          console.log('Primary method failed:', error);
          
          // Fallback method using generic file opening
          try {
            await Linking.openURL(`content://${cleanPath}`);
          } catch (fallbackError) {
            console.log('Fallback method failed:', fallbackError);
            
            // If both methods fail, show PDF viewer installation prompt
            Alert.alert(
              'PDF Viewer Required',
              'Unable to open PDF. Would you like to install a PDF viewer app?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Install Viewer',
                  onPress: () => {
                    Linking.openURL('market://search?q=pdf+viewer&c=apps').catch(() => {
                      Linking.openURL('https://play.google.com/store/search?q=pdf+viewer&c=apps');
                    });
                  },
                },
              ]
            );
          }
        }
      } else {
        // iOS handling remains the same
        const iosUrl = pdfFilePath.startsWith('file://') ? pdfFilePath : `file://${pdfFilePath}`;
        await Linking.openURL(iosUrl);
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert(
        'Error',
        'Could not open the PDF file. Please make sure you have a PDF viewer installed.',
        [
          { text: 'OK' },
          {
            text: 'Install PDF Viewer',
            onPress: () => {
              Linking.openURL('market://search?q=pdf+viewer&c=apps').catch(() => {
                Linking.openURL('https://play.google.com/store/search?q=pdf+viewer&c=apps');
              });
            },
          },
        ]
      );
    }
  };

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
        title={'Download PDF'}
        color={colors.white}
        onPress={onPressContinue}
        containerStyle={localStyles.continueBtnStyle}
      />
      
      {/* {pdfFilePath && (
          <EButton
            type={'S16'}
            title={'View PDF'}
            color={colors.white}
            onPress={handleViewPDF}
            containerStyle={[localStyles.continueBtnStyle, styles.mt10]}
          />
        )} */}
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

import images from '../assets/images';
import {LocationLight} from '../assets/svgs';
import {
  CalenderBg,
  LocationDark,
  LocationIcon,
  ProfileBg,
  TicketBg,
  WalletBg,
} from '../assets/svgs';
import strings from '../i18n/strings';
import {StackNav} from '../navigation/NavigationKeys';

const OnBoardingSlide = [
  {
    text: 'We provide high quality products just for you',
    image: images.onBordingImg1,
  },
  {
    text: 'Your satisfaction is our number one priority',
    image: images.onBordingImg2,
  },
  {
    text: "Let's fulfill your daily needs with Evone right now!",
    image: images.onBordingImg3,
  },
];

const popularEventData = [
  {
    id: 1,
    image: images.attendance,
    title: 'View History',
    url: 'ViewAttendace'
  },
  {
    id: 2,
    image: images.leave,
    title: 'Request Leave',
    url: 'ViewLeaves'
  },
  {
    id: 3,
    image: images.payroll,
    title: 'Payroll',
    url: 'ViewPayroll'
  },
  {
    id: 4,
    image: images.holiday,
    title: 'Holidays',
    url: 'ViewHolidays'
  },

];

const holidayList = [
  { id: '1', holiday: 'Founding Day', date:'22 Feb' },
  { id: '2', holiday: 'Ramadan begins', date:'11 Mar' },
  { id: '3', holiday: 'March Equinox', date:'20 Mar' },
  { id: '4', holiday: 'Eid al-Fitr', date:'10 Apr' },
  { id: '5', holiday: 'Arafat Day', date:'15 Jun' },
  { id: '6', holiday: 'Eid al-Adha', date:'16 Jun' },  
  { id: '7', holiday: 'June Solstice', date:'20 Jun' },
  { id: '8', holiday: 'Muharram', date:'7 Jul' },
  { id: '9', holiday: 'September Equinox', date:'22 Sep' },
  { id: '10', holiday: 'Saudi National Day', date:'23 Sep' },
  { id: '11', holiday: 'December Solstice', date:'21 Dec' },
];

const Month = [
  {label: 'January', value: '01'},
  {label: 'February', value: '02'},
  {label: 'March', value: '03'},
  {label: 'April', value: '04'},
  {label: 'May', value: '05'},
  {label: 'June	', value: '06'},
  {label: 'July', value: '07'},
  {label: 'August', value: '08'},
  {label: 'September', value: '09'},
  {label: 'October', value: '10'},
  {label: 'November', value: '11'},
  {label: 'December', value: '12'},
];

const Year = [
  {label: '2020', value: '2020'},
  {label: '2021', value: '2021'},
  {label: '2022', value: '2022'},
  {label: '2023', value: '2023'},
  {label: '2024', value: '2024'},
];

const Earnings = [
  { id: '1', Earning: 'Basic Pay', salary:'1000.00' },
  { id: '2', Earning: 'Transport Allowance', salary:'110.00' },
  { id: '3', Earning: 'House Rent Allowance', salary:'110.00' },
  { id: '4', Earning: 'Medical Allowance', salary:'110.00' },
  { id: '5', Earning: 'OT Pay', salary:'200.00' },
  { id: '6', Earning: 'PH Pay', salary:'250.00' },  
];

const LeaveType = [
  { id: '1',label:'Casual Leave', value: 'Casual Leave', },
  { id: '2',label:'Sick Leave', value: 'Sick Leave',},
  { id: '3',label:'Annual Leave', value: 'Annual Leave', }, 
  { id: '4',label:'Permission', value: 'Permission', }, 
];

const ProfileSetting = [
  {
    id: 1,
    title: strings.manageEvents,
    icon: 'chatbubble-ellipses-outline',
  },
  {
    id: 2,
    title: strings.messageCenter,
    icon: 'calendar-outline',
    route: StackNav.CustomerService,
    isDivider: true,
  },
  {
    id: 3,
    title: strings.profile,
    icon: 'person-outline',
    route: StackNav.SetUpProfile,
    header: strings.editProfile,
  },
  {
    id: 4,
    title: strings.notification,
    icon: 'notifications-outline',
    route: StackNav.NotificationSetting,
  },
  {
    id: 5,
    title: strings.payment,
    icon: 'wallet-outline',
    route: StackNav.Payment,
  },
  {
    id: 6,
    title: strings.linkedAccounts,
    icon: 'swap-vertical-outline',
    route: StackNav.Address,
  },
  {
    id: 7,
    title: strings.ticketIssues,
    icon: 'cash-outline',
  },
  {
    id: 7,
    title: strings.security,
    icon: 'shield-checkmark-outline',
    route: StackNav.Security,
  },
  {
    id: 8,
    title: strings.language,
    icon: 'options-outline',
    value: 'English(US)',
    route: StackNav.Language,
  },
  {
    id: 9,
    title: strings.darkMode,
    icon: 'contrast-outline',
    rightIcon: 'rightIcon',
  },
  {
    id: 10,
    title: strings.privacyPolicy,
    icon: 'lock-closed-outline',
    route: StackNav.PrivacyPolicy,
  },
  {
    id: 11,
    title: strings.helpCenter,
    icon: 'information-circle-outline',
    route: StackNav.HelpCenter,
  },
  {
    id: 12,
    title: strings.inviteFriends,
    icon: 'people-outline',
    route: StackNav.InviteFriends,
  },
  {
    id: 13,
    title: strings.rateUs,
    icon: 'star-outline',
  },
];

const contactUsData = [
  {
    id: 1,
    title: 'Customer Service',
    icon: 'headset',
  },
  {
    id: 2,
    title: 'WhatsApp',
    icon: 'whatsapp',
  },
  {
    id: 3,
    title: 'Website',
    icon: 'google-earth',
  },
  {
    id: 4,
    title: 'Facebook',
    icon: 'facebook',
  },
  {
    id: 5,
    title: 'Instagram',
    icon: 'instagram',
  },
  {
    id: 6,
    title: 'Twitter',
    icon: 'twitter',
  },
];

const helperCategoryData = [
  'General',
  'Account',
  'Payment',
  'Subscription',
  'Others',
];

const helperData = [
  {
    title: 'What is Evone?',
    description:
      'Anistream is a streaming service that offers a wide variety of anime titles.',
  },
  {
    title: 'How to use Evone?',
    description:
      'You can sign up for Anistream by downloading the app from the App Store or Google Play Store.',
  },
  {
    title: 'How do I cancel a orders product?',
    description:
      'You can remove anime on your wishlist by clicking the heart icon on the anime details page.',
  },
  {
    title: 'Is Evone free to use?',
    description:
      'You can subscribe to premium by clicking the premium button on the home page.',
  },
  {
    title: 'How to add promo on Evone?',
    description:
      'You can download anime by clicking the download icon on the anime details page.',
  },
  {
    title: 'How to unsubscribe from premium?',
    description:
      'You can unsubscribe from premium by clicking the premium button on the home page.',
  },
];

const languageData = [
  {
    title: 'Suggested',
    data: [{lnName: 'English(US)'}, {lnName: 'English(UK)'}],
  },
  {
    title: 'Language',
    data: [
      {
        lnName: 'English',
      },
      {
        lnName: 'Spanish',
      },
      {
        lnName: 'French',
      },
      {
        lnName: 'German',
      },
      {
        lnName: 'Italian',
      },
      {
        lnName: 'Portuguese',
      },
      {
        lnName: 'Russian',
      },
      {
        lnName: 'Turkish',
      },
      {
        lnName: 'Chinese',
      },
      {
        lnName: 'Japanese',
      },
      {
        lnName: 'Korean',
      },
      {
        lnName: 'Arabic',
      },
      {
        lnName: 'Hindi',
      },
      {
        lnName: 'Indonesian',
      },
      {
        lnName: 'Malay',
      },
      {
        lnName: 'Thai',
      },
    ],
  },
];

const privacyPolicyData = [
  {
    title: strings.privacyPolicy1,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy2,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy3,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy2,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy3,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy2,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy3,
    description: strings.privacyPolicyDesc,
  },
];

const userDetail = [
  {
    name: 'Dracel Steward',
    description: 'arianacooper | 24.5M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    name: 'John Doe',
    description: 'johndoe | 10M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Jane Smith',
    description: 'janesmith | 5M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHVzZXIlMjBwcm9maWxlJTIwd2l0aCUyMGJhY2tncm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Bob Johnson',
    description: 'bobjohnson | 2M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Sara Wilson',
    description: 'sarawilson | 1M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Tom Wilson',
    description: 'tomwilson | 500K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Alice Brown',
    description: 'alicebrown | 250K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Emily Davis',
    description: 'emilydavis | 100K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Mark Lee',
    description: 'marklee | 50K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Laura Lee',
    description: 'lauralee | 10K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1610737241336-371badac3b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
];

const chatData = [
  {
    id: 1,
    message: 'Hi Theresa, good morning 😄',
    time: '12:00',
    type: 'sender',
  },
  {
    id: 2,
    message: 'Hi there, good morning! How are you?',
    time: '12:01',
    type: 'receiver',
  },
  {
    id: 3,
    message: 'I am doing well, thanks for asking 😊',
    time: '12:02',
    type: 'sender',
  },
  {
    id: 4,
    message: "That's great to hear! What are your plans for the day?",
    time: '12:03',
    type: 'receiver',
  },
  {
    id: 5,
    message:
      'I have a few meetings scheduled, but otherwise just working from home. How about you?',
    time: '12:04',
    type: 'sender',
  },
  {
    id: 1,
    message: 'Hi Theresa, good morning 😄',
    time: '12:00',
    type: 'sender',
  },
  {
    id: 2,
    message: 'Hi there, good morning! How are you?',
    time: '12:01',
    type: 'receiver',
  },
  {
    id: 3,
    message: 'I am doing well, thanks for asking 😊',
    time: '12:02',
    type: 'sender',
  },
  {
    id: 4,
    message: "That's great to hear! What are your plans for the day?",
    time: '12:03',
    type: 'receiver',
  },
  {
    id: 5,
    message:
      'I have a few meetings scheduled, but otherwise just working from home. How about you?',
    time: '12:04',
    type: 'sender',
  },
  {
    id: 1,
    message: 'Hi Theresa, good morning 😄',
    time: '12:00',
    type: 'sender',
  },
  {
    id: 2,
    message: 'Hi there, good morning! How are you?',
    time: '12:01',
    type: 'receiver',
  },
  {
    id: 3,
    message: 'I am doing well, thanks for asking 😊',
    time: '12:02',
    type: 'sender',
  },
  {
    id: 4,
    message: "That's great to hear! What are your plans for the day?",
    time: '12:03',
    type: 'receiver',
  },
  {
    id: 5,
    message:
      'I have a few meetings scheduled, but otherwise just working from home. How about you?',
    time: '12:04',
    type: 'sender',
  },
];

const walletData = [
  {
    id: 1,
    product: 'Suga Leather Shoes',
    price: '$100',
    date: 'Dec 15, 2024 | 12:00 PM',
    status: strings.orders,
    productImage: images.shoes1,
  },
  {
    id: 2,
    product: strings.topUpWallet,
    price: '$150',
    date: 'Jan 05, 2023 | 12:50 PM',
    status: strings.topUp,
  },
  {
    id: 3,
    product: 'Werolla Cardigans',
    price: '$385',
    date: 'Dec 14, 2024 | 11:34 PM',
    status: strings.orders,
    productImage: images.clothe3,
  },
  {
    id: 4,
    product: 'Mini Leather Bag',
    price: '$653',
    date: 'Dec 13, 2024 | 03:23 AM',
    status: strings.orders,
    productImage: images.bag1,
  },
  {
    id: 5,
    product: strings.topUpWallet,
    price: '$600',
    date: 'Dec 12, 2024 | 02:50 AM',
    status: strings.topUp,
  },
  {
    id: 6,
    product: 'Puma Leather Shoes',
    price: '$356',
    date: 'Dec 03, 2024 | 02:34 PM',
    status: strings.orders,
    productImage: images.shoes2,
  },
  {
    id: 7,
    product: 'Sony Microphone',
    price: '$354',
    date: 'Aug 07, 2023 | 05:40 PM ',
    status: strings.orders,
    productImage: images.mic1,
  },
  {
    id: 8,
    product: 'Gucci Leather Bag',
    price: '$100',
    date: 'Jul 15, 2023 | 12:00 PM',
    status: strings.orders,
    productImage: images.bag2,
  },
  {
    id: 9,
    product: strings.topUpWallet,
    price: '$560',
    date: 'Jan 05, 2023 | 12:50 PM',
    status: strings.topUp,
  },
];

const mostPopularData = [
  '✅ All',
  '🎵 Music',
  '💼 Workshops',
  '🎨 Art',
  '🍕 Food & Drink',
  '🧥 Fashion',
];

const notificationData = [
  {
    id: 1,
    image: <CalenderBg />,
    title: 'Booking Successful!',
    description: '20 Dec, 2022 | 20:49 PM',
    desc: "You have successfully booked the Art Workshops. The event will be held on Sunday, December 22, 2022, 13.00 - 14.00 PM. Don't forget to activate your reminder. Enjoy the event!",
    isNew: true,
  },
  {
    id: 2,
    image: <CalenderBg />,
    title: 'Booking Successful!',
    description: '19 Dec, 2022 | 12:00 PM',
    desc: "You have successfully booked the National Music Festival. The event will be held on Monday, December 24, 2022, 18.00 - 23.00 PM. Don't forget to activate your reminder. Enjoy the event!",
    isNew: true,
  },
  {
    id: 3,
    image: <TicketBg />,
    title: 'New Services Available!',
    description: '14 Dec, 2022 | 12:00 PM',
    desc: 'You can now make multiple book events at once. You can also cancel your booking.',
  },
  {
    id: 4,
    image: <WalletBg />,
    title: 'Credit Card Connected!',
    description: '12 Dec, 2022 | 12:00 PM',
    desc: 'Your credit card has been successfully linked with Eveno. Enjoy our service.',
  },
  {
    id: 5,
    image: <ProfileBg />,
    title: 'Account Setup Successful!',
    description: '12 Dec, 2022 | 12:00 PM',
    desc: 'Your account creation is successful, you can now experience our services.',
  },
];

const reviewsData = [
  {
    id: 1,
    name: 'John Duew',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',

    rating: 5,
    review:
      'The item is very good, my son likes it very much and plays every day 💯💯💯',
    like: 352,
    time: '6 days ago',
  },
  {
    id: 2,
    name: 'Jane Doe',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',

    rating: 4,
    review:
      'The item is good, but it could be better. My son likes it, but he has some complaints about it.',
    like: 100,
    time: '2 days ago',
  },
  {
    id: 3,
    name: 'Bob Smith',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',

    rating: 3,
    review:
      'The item is okay, but it could be better. My son likes it, but he has some complaints about it.',
    like: 50,
    time: '1 day ago',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',

    rating: 2,
    review:
      'The item is not very good. My son does not like it very much and does not play with it often.',
    like: 10,
    time: '1 hour ago',
  },
  {
    id: 5,
    name: 'Tom Hanks',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',

    rating: 1,
    review:
      'The item is terrible. My son hates it and does not play with it at all.',
    like: 1,
    time: '1 minute ago',
  },
  {
    id: 6,
    name: 'Megan Fox',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',

    rating: 5,
    review:
      'The item is very good, my son likes it very much and plays every day 💯💯💯',
    like: 352,
    time: '6 days ago',
  },
  {
    id: 7,
    name: 'Samantha Smith',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',

    rating: 4,
    review:
      'The item is good, but it could be better. My daughter likes it, but she has some complaints about it.',
    like: 200,
    time: '3 days ago',
  },
  {
    id: 8,
    name: 'David Johnson',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',

    rating: 3,
    review:
      'The item is okay, but it could be better. My daughter likes it, but she has some complaints about it.',
    like: 100,
    time: '2 days ago',
  },
  {
    id: 9,
    name: 'Emily Brown',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',

    rating: 2,
    review:
      'The item is not very good. My daughter does not like it very much and does not play with it often.',
    like: 20,
    time: '1 day ago',
  },
  {
    id: 10,
    name: 'Olivia Davis',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',

    rating: 1,
    review:
      'The item is terrible. My daughter hates it and does not play with it at all.',
    like: 2,
    time: '1 hour ago',
  },
  {
    id: 11,
    name: 'Sophia Wilson',
    image: 'https://randomuser.me/api/portraits/women/7.jpg',

    rating: 5,
    review:
      'The item is very good, my daughter likes it very much and plays every day 💯💯💯',
    like: 352,
    time: '6 days ago',
  },
];


const eventDerailData = [
  {
    id: 1,
    image: <CalenderBg />,
    title: 'Monday, December 24, 2022',
    description: '18.00 - 23.00 PM (GMT +07:00)',
    btn: 'Add to My Calendar',
    btnIcon: 'calendar-outline',
  },
  {
    id: 2,
    image: <LocationDark />,
    title: 'Grand Park, New York City, US',
    description: 'Grand City St. 100, New York, United States.',
    btn: 'See Location on Maps',
    btnIcon: 'location-outline',
  },
  {
    id: 3,
    image: <LocationLight />,
    title: '$20.00 - $100.00',
    description: 'Ticket price depends on package.',
  },
];

const concertImageData = [
  {
    id: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1481886756534-97af88ccb438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1473261422289-ece70cf625d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1519736927049-de9d69a15bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
  },
  {
    id: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1428992992979-aaeb02b6960c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 6,
    imageUrl:
      'https://images.unsplash.com/uploads/1411160110892ab555b6f/80b0d25e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
  },
  {
    id: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1556340346-5e30da977c4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1442504028989-ab58b5f29a4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 11,
    imageUrl:
      'https://images.unsplash.com/17/unsplash_5252bb51404f8_1.JPG?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1506026667107-3350a4c8eca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 13,
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
];

const cancelBookingData = [
  {
    id: 1,
    title: 'I have another event, so it collides',
  },
  {
    id: 2,
    title: "I'm sick, can't come",
  },
  {
    id: 3,
    title: 'I have an urgent need',
  },
  {
    id: 4,
    title: 'I have no transportation to come',
  },
  {
    id: 5,
    title: 'I have no friends to come',
  },
  {
    id: 6,
    title: 'I want to book another event',
  },
  {
    id: 7,
    title: 'I just want to cancel',
  },
];

const upcomingData = [
  {
    id: 1,
    image: 'https://picsum.photos/200/300?random=1',
    title: 'Creative Writing Workshop',
    time: 'scs',
    address: 'ddd',
    isFree: true,
  },
  {
    id: 2,
    image: 'https://picsum.photos/200/300?random=2',
    title: 'Acrylic Painting Class',
    time: 'Sat, Jun 15 • 11.00 - 13.00 AM',
    address: 'Art Center, Seattle',
  },
  {
    id: 3,
    image: 'https://picsum.photos/200/300?random=3',
    title: 'Knitting and Crochet Workshop',
    time: 'Sun, Jul 12 • 15.00 - 17.00 PM',
    address: 'Community Center, Portland',
  },
  {
    id: 4,
    image: 'https://picsum.photos/200/300?random=4',
    title: 'Digital Photography Class',
    time: 'Tue, Aug 18 • 18.00 - 20.00 PM',
    address: 'Art School, Los Angeles',
    isFree: true,
  },
  {
    id: 5,
    image: 'https://picsum.photos/200/300?random=5',
    title: 'Ceramics Workshop',
    time: 'Thu, Sep 22 • 13.00 - 15.00 PM',
    address: 'Pottery Studio, Denver',
  },
  {
    id: 6,
    image: 'https://picsum.photos/200/300?random=6',
    title: 'Screenwriting Seminar',
    time: 'Sat, Oct 8 • 14.00 - 16.00 PM',
    address: 'Film School, Chicago',
  },
  {
    id: 7,
    image: 'https://picsum.photos/200/300?random=7',
    title: 'Street Photography Walk',
    time: 'Mon, Nov 14 • 16.00 - 18.00 PM',
    address: 'Downtown Area, Boston',
  },
  {
    id: 8,
    image: 'https://picsum.photos/200/300?random=8',
    title: 'Oil Pastels Workshop',
    time: 'Wed, Dec 27 • 11.00 - 13.00 PM',
    address: 'Art Museum, Miami',
  },
  {
    id: 9,
    image: 'https://picsum.photos/200/300?random=9',
    title: 'Graffiti Art Class',
    time: 'Fri, Jan 5 • 17.00 - 19.00 PM',
    address: 'Community Center, New York',
    isFree: true,
  },
  {
    id: 10,
    image: 'https://picsum.photos/200/300?random=10',
    title: 'Watercolor Painting Workshop',
    time: 'Sun, Feb 11 • 12.00 - 14.00 PM',
    address: 'Art Studio, San Francisco',
  },
];

const cancelData = [
  {
    id: 1,
    image: 'https://picsum.photos/id/1000/400/250',
    title: 'Baking Class',
    time: 'Sat, May 7 • 11.00 - 13.00 AM',
    address: 'Baker Street Kitchen, London',
  },
  {
    id: 2,
    image: 'https://picsum.photos/id/1001/400/250',
    title: 'Knitting Workshop',
    time: 'Tue, Jun 15 • 14.00 - 16.00 PM',
    address: 'Cozy Cafe, Paris',
    isFree: true,
  },
  {
    id: 3,
    image: 'https://picsum.photos/id/1002/400/250',
    title: 'Potluck Picnic',
    time: 'Sun, Aug 1 • 12.00 - 15.00 PM',
    address: 'Central Park, New York',
  },
  {
    id: 4,
    image: 'https://picsum.photos/id/1003/400/250',
    title: 'Gardening Workshop',
    time: 'Thu, Sep 23 • 10.00 - 12.00 AM',
    address: 'Botanical Garden, Sydney',
  },
  {
    id: 5,
    image: 'https://picsum.photos/id/1004/400/250',
    title: 'Dance Performance',
    time: 'Sat, Nov 12 • 19.00 - 21.00 PM',
    address: 'Theatre Royal, Melbourne',
    isFree: true,
  },
];

const bookedData = [
  {
    id: 1,
    image: 'https://picsum.photos/400/200?random=1',
    title: 'Coffee Tasting',
    time: 'Sun, Apr 23 • 9.00 - 11.00 AM',
    address: 'The Roastery, Portland',
    isFree: true,
  },
  {
    id: 2,
    image: 'https://picsum.photos/400/200?random=2',
    title: 'Film Screening',
    time: 'Fri, May 11 • 18.00 - 20.00 PM',
    address: 'Cinema Paradiso, San Francisco',
  },
  {
    id: 3,
    image: 'https://picsum.photos/400/200?random=3',
    title: 'Fashion Show',
    time: 'Sat, Jun 9 • 19.00 - 21.00 PM',
    address: 'Fashion Institute of Technology, New York',
  },
  {
    id: 4,
    image: 'https://picsum.photos/400/200?random=4',
    title: 'Street Art Festival',
    time: 'Sun, Jul 15 • 12.00 - 18.00 PM',
    address: 'Wynwood Walls, Miami',
    isFree: true,
  },
  {
    id: 5,
    image: 'https://picsum.photos/400/200?random=5',
    title: 'Comedy Night',
    time: 'Thu, Aug 23 • 20.00 - 22.00 PM',
    address: 'The Comedy Store, Los Angeles',
  },
  {
    id: 6,
    image: 'https://picsum.photos/400/200?random=6',
    title: 'Cheese and Wine Pairing',
    time: 'Fri, Sep 7 • 17.00 - 19.00 PM',
    address: 'The Cheese Shop, Seattle',
  },
  {
    id: 7,
    image: 'https://picsum.photos/400/200?random=7',
    title: 'Poetry Slam',
    time: 'Sat, Oct 20 • 19.00 - 21.00 PM',
    address: 'The Green Mill, Chicago',
    isFree: true,
  },
  {
    id: 8,
    image: 'https://picsum.photos/400/200?random=8',
    title: 'Street Food Fair',
    time: 'Sun, Nov 18 • 11.00 - 15.00 PM',
    address: 'The Food Trucks, Austin',
  },
];

// const ProjectListData = [
//   {
//     id: 1,
//     title: 'Building Construction',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 2,
//     title: 'abc construction',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 3,
//     title: 'Bus stop moving at Jalan Besar',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 4,
//     title: 'Mobile app development',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },  
//   {
//     id: 5,
//     title: 'Beauty products',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 6,
//     title: 'software training',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 7,
//     title: 'App installation',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 8,
//     title: 'Installing signage',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 9,
//     title: 'aircon replacement',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
//   {
//     id: 10,
//     title: 'Float @ Marina Bay',
//     daycheckIn:"Day Check In",
//     daycheckout:"Day Check Out",
//     nightcheckIn:"Night Check In",
//     nightcheckout:"Night Check Out"
//   },
// ];

const AttendanceData = [
  {
    id: 1,
    image: images.checkIn,
    title: 'Day Attendance',
    subtitle:"Check In"
  },
  {
    id: 2,
    image: images.checkIn,
    title: 'Night Attendance',
    subtitle:"Check In"
  },
];

const ProjectTitleData = [
  {label: 'Tender', value: 'tender'},
  {label: 'Project', value: 'project'},
  {label: 'Client', value: 'client'},
  {label: 'Booking', value: 'booking'},
  {label: 'Timesheet', value: 'timesheet'},
  {label: 'Product', value: 'product'},
  {label: 'Finance', value: 'finance'},
];

export {
  ProfileSetting,
  Month,
  OnBoardingSlide,
  contactUsData,
  helperCategoryData,
  helperData,
  languageData,
  privacyPolicyData,
  userDetail,
  chatData,
  walletData,
  mostPopularData,
  notificationData,
  reviewsData,
  popularEventData,
  Year,
  eventDerailData,
  concertImageData,
  cancelBookingData,
  upcomingData,
  cancelData,
  bookedData,
  // ProjectListData,
  AttendanceData,
  ProjectTitleData,
  holidayList,
  Earnings,LeaveType
};

// Tab Routes
// import MainHome from '../containers/tabbar/main/HomeTab';
// import TaskTab from '../containers/tabbar/taskList/TaskTab';

// // Screens Route
import Splash from '../containers/auth/Splash';
import WelcomeScreen from '../containers/WelcomeScreen';
import OnBoarding from '../containers/OnBoarding';
import Login from '../containers/auth/Login';
import TabBar from './Type/TabBarNavigation';
import Connect from '../containers/auth/Connect';
import SelfieWithId from '../containers/auth/SelfieWithId';
import HomeListCard from '../containers/tabbar/HomeListCard';
import ViewAttendace from '../containers/tabbar/main/ViewAttendace';
import ViewHolidays from '../containers/tabbar/main/ViewHolidays';
import ViewLeaves from '../containers/tabbar/main/ViewLeaves';
import ViewPayroll from '../containers/tabbar/main/ViewPayroll';
import GeneratePayslip from '../containers/tabbar/main/GeneratePayslip';
import RequestLeave from '../containers/tabbar/main/RequestLeave';

export const TabRoute = {
  // MainHome,
  // TaskTab,
};

export const StackRoute = {
  Splash,
  WelcomeScreen,
  OnBoarding,
  Login,
  TabBar,
  Connect,
  SelfieWithId,
  HomeListCard,
  ViewAttendace,
  ViewHolidays,
  ViewLeaves,
  ViewPayroll,
  GeneratePayslip,
  RequestLeave
};

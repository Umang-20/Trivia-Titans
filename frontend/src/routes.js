import SignIn from "./pages/Auth/SignIn";
import BrowseGamesPage from "./pages/Browse Games";
import SignUp from "./pages/Auth/SignUp";
import GameLobby from "./pages/Game Lobby/ index";
import Leaderboard from "./pages/Leaderboard";
import ChatApp from "./components/TeamChat";
import Chatbot from "./pages/Chatbot";
import MFA from "./pages/Auth/MFA";
import Profile from "./pages/UserProfile";
import teamManagement from "./pages/teamManagement";
import ForgotPassword from "./pages/Auth/forgotPassword";
import QuestionPage from "./pages/Questions/QuestionPage";
import GamePage from "./pages/Games/GamePage";
import NotificationPage from "./pages/Notifications/NotificationPage";
import ReportPage from "./pages/Report/Analysis";

const routes = [
  {
    path: "/",
    name: "SignIn",
    component: SignIn,
    layout: "auth",
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    layout: "auth",
  },
  {
    path: "/mfa",
    name: "MFA",
    component: MFA,
    layout: "auth",
  },
  {
    path: "forgotPassword",
    name: "forgotPassword",
    component: ForgotPassword,
    layout: "auth",
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    layout: "private",
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: Leaderboard,
    layout: "private",
  },
  {
    path: "/dashboard",
    name: "Browse Games",
    component: BrowseGamesPage,
    layout: "private",
  },
  {
    path: "/game/:gameId",
    name: "Game Lobby",
    component: GameLobby,
    layout: "private",
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatApp,
    layout: "private",
  },
  {
    path: "/chatbot",
    name: "Chatbot",
    component: Chatbot,
    layout: "private",
  },
  {
    path: "/teamManagement",
    name: "teamManagement",
    component: teamManagement,
    layout: "public",
  },
  {
    path: "/questions",
    name: "Questions",
    component: QuestionPage,
    layout: "public",
  },
  {
    path: "/games",
    name: "Games",
    component: GamePage,
    layout: "public",
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: NotificationPage,
    layout: "public",
  },
  {
    path: "/report",
    name: "Report",
    component: ReportPage,
    layout: "public",
  },
];

export default routes;

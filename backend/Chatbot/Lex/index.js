import axios from "axios";

export const handler = async (event, context) => {
  const interpretations = event.interpretations;
  const intentName = interpretations[0].intent.name;
  const slots = interpretations[0].intent.slots;

  if (intentName === "NavigationIntent") {
    const pageName = slots.NavigationPage?.value?.interpretedValue;

    let responseMessage;
    let link;

    switch (pageName) {
      case "home":
      case "dashboard":
      case "browse games":
        link = "https://sdp35-kmskozun5a-uc.a.run.app/dashboard";
        break;
      case "sign in":
        link = "https://sdp35-kmskozun5a-uc.a.run.app/";
        break;
      case "sign up":
        link = "https://sdp35-kmskozun5a-uc.a.run.app/signup";
        break;
      case "leaderboard":
        link = "https://sdp35-kmskozun5a-uc.a.run.app/leaderboard";
        break;
      case "profile":
        link = "https://sdp35-kmskozun5a-uc.a.run.app/profile";
        break;
      case "game lobby":
        link = "https://sdp35-kmskozun5a-uc.a.run.app/game";
        break;
      case "team management":
        link = "https://sdp35-kmskozun5a-uc.a.run.app/teamManagement";
        break;
      default:
        link = null;
    }

    if (link) {
      responseMessage = `Sure! Here's the link to the ${pageName} page: [${link}]`;
    } else {
      responseMessage = "I'm sorry, I couldn't determine the page name.";
    }

    const response = {
      sessionState: {
        dialogAction: {
          type: "Close",
        },
        intent: {
          confirmationState: "Confirmed",
          name: intentName,
          state: "Fulfilled",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: responseMessage,
        },
      ],
    };

    return response;
  } else if (intentName === "SearchScoreIntent") {
    const teamName = slots.TeamName;
    const playerName = slots.PlayerName;
    const name =
      teamName?.value?.originalValue || playerName?.value?.originalValue;

    if (!name) {
      const responseMessage = "Please provide the name of the team or player.";

      const response = {
        sessionState: {
          dialogAction: {
            type: "ElicitSlot",
            intentName: intentName,
            slots: slots,
            slotToElicit: teamName ? "PlayerName" : "TeamName",
          },
          intent: {
            confirmationState: "None",
            name: intentName,
            state: "InProgress",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: responseMessage,
          },
        ],
      };

      return response;
    } else {
      let responseMessage;
      let responseScore;

      try {
        const { data } = await axios.post(
          "https://us-east1-project-csci5410.cloudfunctions.net/getLeaderboardByName",
          {
            name,
          }
        );
        responseScore = data.data[0].score;
      } catch (error) {
        console.error("Error sending API request:", error);
      }

      responseMessage =
        responseScore !== null
          ? `The score for ${name} is ${responseScore}.`
          : `No score found for ${name}.`;

      const response = {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            confirmationState: "Confirmed",
            name: intentName,
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: responseMessage,
          },
        ],
      };

      return response;
    }
  }
};

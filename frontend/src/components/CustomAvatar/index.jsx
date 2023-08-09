import { Avatar } from "@mui/material";
import { deepOrange, deepPurple } from "@mui/material/colors";
import {
  blue,
  green,
  orange,
  purple,
  red,
  teal,
  pink,
  yellow,
  indigo,
  cyan,
} from "@mui/material/colors";

const generateInitials = (name) => {
  //   const nameArray = name.split(" ");
  //   const initials = nameArray.reduce((acc, curr) => acc + curr[0].toUpperCase(), "");
  return name[0].toUpperCase();
};

const chooseRandomColor = () => {
  const colors = [
    blue[500],
    green[500],
    orange[500],
    purple[500],
    red[500],
    teal[500],
    pink[500],
    yellow[500],
    indigo[500],
    cyan[500],
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

const randomColor = chooseRandomColor();

const CustomAvatar = ({ name, color }) => {
  const initials = generateInitials(name);

  return (
    <Avatar
      sx={{
        width: 64,
        height: 64,
        bgcolor: color ? color : randomColor,
        fontWeight: "bold",
        border: "1px solid rgba(255,255,255, 0.15)",
        boxShadow: "1px 2px 6px rgba(0, 0, 0, 0.2)",
        fontSize: "24px",
      }}>
      {initials}
    </Avatar>
  );
};

export default CustomAvatar;

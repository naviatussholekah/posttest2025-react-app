import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";

export default function Profile() {
  const user = {
    nama: "Naviatus Sholekah",
    email: "naviatussholekah@ogya.co.id",
    profPic:
      "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png",
  };

  const profileContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "0 4px 8px rgba(47, 47, 126, 0.1)",
  };

  const profileCardStyle = {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(3, 3, 36, 0.1)",
    width: "auto",
    maxWidth: "500px",
  };

  const profileContentStyle = {
    display: "flex",
    alignItems: "center",
  };

  const profilePicStyle = {
    marginRight: "20px",
  };

  const profileInfoStyle = {
    textAlign: "left",
  };

  const nameStyle = {
    fontSize: "24px",
    marginBottom: "5px",
  };

  const emailStyle = {
    fontSize: "16px",
    color: "#666",
  };

  return (
    <div style={profileContainerStyle}>
      <Card style={profileCardStyle}>
        <div style={profileContentStyle}>
          <Avatar
            image={user.profPic}
            size="xlarge"
            shape="circle"
            style={profilePicStyle}
          />
          <div style={profileInfoStyle}>
            <h2 style={nameStyle}>{user.nama}</h2>
            <p style={emailStyle}>{user.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

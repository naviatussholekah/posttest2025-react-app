import { MegaMenu } from "primereact/megamenu";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import logo from "../logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Hitung PPN",
      icon: "pi pi-calculator",
      command: () => navigate("/taxCount"),
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => navigate("/profile"),
    },
  ];

  const start = (
    <img
      src={logo}
      alt="Logo Ogya"
      className="App-logo"
      style={{ height: "30px" }}
    />
  );

  const end = (
    <Avatar
      image="https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
      shape="circle"
    />
  );

  return (
    <div className="card">
            
    <MegaMenu
      model={items}
      orientation="horizontal"
      start={start}
      end={end}
      breakpoint="960px"
      className="p-3 surface-0 shadow-2"
      style={{ borderRadius: "3rem" }}
    />
    </div>
  );
}

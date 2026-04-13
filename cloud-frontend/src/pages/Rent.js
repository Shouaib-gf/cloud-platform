import axios from "axios";

export default function Rent() {

  const API = "http://192.168.159.157:3000";
  const userId = localStorage.getItem("userId");

  const rent = async (plan) => {
    await axios.post(`${API}/api/request/create`, {
      vm_name: "vm-" + Date.now(),
      plan,
      userId
    });
    alert("Request sent ⏳");
  };

  const Card = ({title, specs, plan}) => (
    <div className="bg-white p-6 rounded shadow text-center">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="my-2">{specs}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => rent(plan)}>
        Rent
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card title="Standard" specs="2 CPU / 2GB RAM" plan="standard"/>
      <Card title="Premium" specs="4 CPU / 4GB RAM" plan="premium"/>
      <Card title="Enterprise" specs="8 CPU / 8GB RAM" plan="enterprise"/>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [vms, setVms] = useState([]);
  const userId = localStorage.getItem("userId");

  const API = "http://192.168.159.157:3000";

  const fetch = async () => {
    const res = await axios.get(`${API}/api/request/user/${userId}`);
    setVms(res.data);
  };

  useEffect(() => {
    fetch();
    setInterval(fetch, 5000);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      {vms.map(vm => (
        <div key={vm._id} className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">{vm.vm_name}</h3>

          <p>Status: 
            <span className={`ml-2 font-bold ${
              vm.status === "accepted" ? "text-green-600" : "text-yellow-500"
            }`}>
              {vm.status}
            </span>
          </p>

          {vm.status === "accepted" && (
            <div className="mt-2 text-sm">
              <p>IP: {vm.vm_ip}</p>
              <p>ssh cloud@{vm.vm_ip}</p>
              <p>Password: 123456</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

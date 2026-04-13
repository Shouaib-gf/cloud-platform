import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {

  const [requests, setRequests] = useState([]);
  const API = "http://192.168.159.157:3000";

  const fetch = async () => {
    const res = await axios.get(`${API}/api/request/all`);
    setRequests(res.data);
  };

  const approve = async (id) => {
    await axios.post(`${API}/api/request/approve/${id}`);
    fetch();
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="space-y-4">
      {requests.map(r => (
        <div key={r._id} className="bg-white p-4 rounded shadow flex justify-between">
          <div>
            <p>{r.vm_name}</p>
            <p className="text-sm">{r.status}</p>
          </div>

          {r.status === "waiting" && (
            <button
              className="bg-green-600 text-white px-4 rounded"
              onClick={() => approve(r._id)}>
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

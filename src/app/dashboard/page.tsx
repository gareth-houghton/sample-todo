"use client"

import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";

const supersetUrl = "http://localhost:8088";
const supersetApiUrl = supersetUrl + "/api/v1/security";
const dashboardId = "8c39a821-b832-4d4c-80e0-20ce8b2e27f2";

async function getToken(){
  const login_body = {
    "password": "admin",
    "provider": "db",
    "refresh": true,
    "username": "admin"
  };
  const login_headers = {
    "headers": {
      "Content-Type": "application/json"
    }
  };

  const { data } = await axios.post(supersetApiUrl + "/login", login_body, login_headers);
  const accessToken = data["access_token"];
  
  const guest_token_body = JSON.stringify({
    "resources": [
      {
        "type": "dashboard",
        "id": dashboardId,
      }
    ],
    "rls": [],
    "user": {
      "username": "",
      "first_name": "",
      "last_name": "",
    }
  });

  const guest_token_headers = {
    "headers": {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + accessToken
    }
  }

  await axios.post(supersetApiUrl + "/guest_token/", guest_token_body, guest_token_headers).then(dt => {
    embedDashboard({
      id: dashboardId,
      supersetDomain: supersetUrl,
      mountPoint: document.getElementById("superset-container"),
      fetchGuestToken: () => dt.data["token"],
      dashboardUiConfig: {
        filters: {
          expanded: true
        },
        urlParams: {
          standalone: 3
        }
      }
    });
  });

  var iframe = document.querySelector("iframe");
  if(iframe) {
    iframe.style.width = "100%"
    iframe.style.minHeight = "100vw"
  }
}

export default function Home(){
  getToken();
  
  return (
    <div className="App">
      <div id="superset-container"></div>
    </div>
  )
}
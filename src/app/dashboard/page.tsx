"use client"

import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useRef, useEffect, useState } from "react";

const supersetUrl = "http://localhost:8088";
const supersetApiUrl = supersetUrl + "/api/v1/security";
const dashboardId = "61780778-231a-40f4-b6a9-04b8c94c5636";

async function fetchGuestTokenFromBackend() : Promise<string> {
  try{
    // Superset Login
    const apiRes = await fetch(supersetApiUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "password": "admin",
        "provider": "db",
        "refresh": true,
        "username": "admin"
      }),
    });
    const { access_token: accessToken } = await apiRes.json();

    // Fetch CSRF token
    const csrfTokenRes = await fetch(supersetApiUrl + "/csrf_token/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    });
    const { result: csrfToken } = await csrfTokenRes.json()
    const csrfTokenCookies = csrfTokenRes.headers.get("Set-Cookie") || "";

    // Fetch guest token with limited access
    const guestTokenRes = await fetch(supersetApiUrl + "/guest_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-CSRFToken": csrfToken,
        "Cookie": csrfTokenCookies
      },
      body: JSON.stringify({
        "resources": [
          {
            "id": dashboardId,
            "type": "dashboard"
          }
        ],
        "rls": [],
        "user": {
          "first_name": "guest",
          "last_name": "guest",
          "username": "guest"
        }
      }),
    });
    const { token: guestToken } = await guestTokenRes.json();

    return guestToken;
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const useSupersetEmbed = (id: string) => {
  const [mounted, setMounted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ( !elementRef.current ) return;
    if ( mounted ) return;

    void embedDashboard({
      id: id,
      supersetDomain: supersetUrl,
      mountPoint: elementRef.current,
      fetchGuestToken: async () => await fetchGuestTokenFromBackend(),
      dashboardUiConfig: {
        hideTitle: true,
        hideChartControls: true,
        // hideTab: true,
        filters: {
          visible: false,
          
       }
      }
    });

    setMounted(true)
  }, [id, mounted]);

  return elementRef;
};

export default function Home(){
  const embed = useSupersetEmbed(dashboardId);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iFrameSuperset = embed.current!.children[0]

    if (iFrameSuperset) {

    }
  }, [parentRef]);

  return (
    <div className="App w-full h-full" ref={parentRef}>
      <div className="superset-container w-full h-full" ref={embed}></div>
    </div>
  )
}
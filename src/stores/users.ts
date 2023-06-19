import { defineStore } from "pinia";
import jwt_decode from "jwt-decode";
import clubApi from "@/api/clubs";

export const useUserStore = defineStore({
  id: "clubUser",
  state: () => ({
    permissions: [],
    clubCode: "",
    clubName: "",
  }),
  actions: {
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setClubCode(clubCode) {
      this.clubCode = clubCode;
    },
    setClubName(clubName) {
      // New setter for the club name
      this.clubName = clubName;
    },
    async decodeToken(getAccessTokenSilently) {
      const token = await getAccessTokenSilently();
      const decodedToken = jwt_decode(token);
      this.setPermissions(decodedToken.permissions);
      this.setClubCode(decodedToken.clubCode);

      await this.getClubName(decodedToken.clubCode);
    },
    async getClubName(clubCode) {
      try {
        const response = await clubApi.getClub({ clubcode: clubCode });
        this.setClubName(response.data.name);
        console.log(this.clubName);
      } catch (err) {
        console.error(`Could not get club name, because: ${err}`);
      }
    },
  },
});

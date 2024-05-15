import { defineStore } from "pinia";
import { jwtDecode, JwtPayload } from "jwt-decode";
import clubApi from "@/api/clubs";

export type UserStoreType = {
  // State
  permissions: any[];
  clubCode: string;
  clubName: string;

  // Actions
  setPermissions: (permissions: any[]) => void;
  setClubCode: (clubCode: string) => void;
  setClubName: (clubName: string) => void;
  decodeToken: (getAccessTokenSilently: any) => Promise<void>;
  getClubName: (clubCode: string) => Promise<void>;
};

interface CustomJwtPayload extends JwtPayload {
  permissions: any[];
  clubCode: string;
}

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
      this.clubName = clubName;
    },
    async decodeToken(getAccessTokenSilently) {
      const token = await getAccessTokenSilently();
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      this.setPermissions(decodedToken.permissions);
      this.setClubCode(decodedToken.clubCode);

      await this.getClubName(decodedToken.clubCode);
    },
    async getClubName(clubCode) {
      try {
        const response = await clubApi.getClub({ clubcode: clubCode });
        this.setClubName(response.data.name);
      } catch (err) {
        console.error(`Could not get club name, because: ${err}`);
      }
    },
  },
});

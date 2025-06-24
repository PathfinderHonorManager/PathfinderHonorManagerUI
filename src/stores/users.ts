import { defineStore } from "pinia";
import { jwtDecode, JwtPayload } from "jwt-decode";
import clubApi from "@/api/clubs";

export type UserStoreType = {
  // State
  permissions: any[];
  clubCode: string;
  clubName: string;
  isLoadingClub: boolean;

  // Actions
  setPermissions: (permissions: any[]) => void;
  setClubCode: (clubCode: string) => void;
  setClubName: (clubName: string) => void;
  setLoadingClub: (loading: boolean) => void;
  decodeToken: (getAccessTokenSilently: any) => Promise<void>;
  getClubName: (clubCode: string) => Promise<void>;
};

interface CustomJwtPayload extends JwtPayload {
  permissions: any[];
  clubCode: string;
}

export const useUserStore = defineStore("clubUser", {
  state: () => ({
    permissions: [] as any[],
    clubCode: "",
    clubName: "",
    isLoadingClub: true,
  }),
  actions: {
    setPermissions(permissions: any[]) {
      this.permissions = permissions;
    },
    setClubCode(clubCode: string) {
      this.clubCode = clubCode;
    },
    setClubName(clubName: string) {
      this.clubName = clubName;
    },
    setLoadingClub(loading: boolean) {
      this.isLoadingClub = loading;
    },
    async decodeToken(getAccessTokenSilently: any) {
      const token = await getAccessTokenSilently();
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      this.setPermissions(decodedToken.permissions);
      this.setClubCode(decodedToken.clubCode);

      await this.getClubName(decodedToken.clubCode);
    },
    async getClubName(clubCode: string) {
      this.setLoadingClub(true);
      try {
        const response = await clubApi.getClub({ clubcode: clubCode });
        this.setClubName(response.data.name);
      } catch (err) {
        console.error(`Could not get club name, because: ${err}`);
      } finally {
        this.setLoadingClub(false);
      }
    },
  },
});

import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { commonStyles } from "../../style/CommonStyles";
import { useAuth } from "../authentication/AuthProvider";
import { ProfileScreenName } from "../../types/Profile";
import { SetState } from "../../types/General";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { getHealthData, uploadImg } from "../../functions/apiCalls";
import { AxiosError } from "axios";

type Props = {
  setCurrentScreen: SetState<ProfileScreenName>;
  setDateCheck: SetState<string>;
};

const ProfileView = ({ setCurrentScreen, setDateCheck }: Props) => {
  const auth = useAuth();

  const [responseDates, setResponseDates] = useState([""]);
  const [prevResponse, setPrevResponse] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchImage;
  }, []);

  async function fetchImage() {}

  async function fetchData() {
    const dates: string[] = [];
    getHealthData(auth.authToken)
      .then(({ data: res }) => {
        for (const entry of res.health_data) {
          dates.push(entry.date);
        }
        setResponseDates(dates);
        setPrevResponse(true);
      })
      .catch((err: AxiosError) => {
        // possibly invalid token, but should do more error validation
        console.log(err.message);
        setPrevResponse(false);

        // setLoadingCreds(false);
      });
  }

  const logout = () => {
    auth.clearAuth();
    // should do some loading here bc clearAuth is an async call
  };

  function submitImg() {
    if (!selectedFile) {
      console.log("no img selected");
      return;
    }
    uploadImg(selectedFile, auth.currentUser.username)
      .then(() => {
        console.log("sent");
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
      });
  }

  return (
    <>
      <View style={commonStyles.centerStack}>
        <View style={styles.picture}>
          <Button onPress={logout}>Logout</Button>
          <Text variant="displayMedium">Pic</Text>
          <input type="file" onChange={handleFileChange}></input>
          <Button onPress={() => submitImg()}>Submit</Button>
          <Text>{auth.currentUser.username}</Text>
          {responseDates[0].length < 1 ? (
            <Button mode="contained" onPress={() => setCurrentScreen("Survey")}>
              Enter Primary Health Information
            </Button>
          ) : (
            <Button mode="contained" onPress={() => setCurrentScreen("Survey")}>
              Update Health Information
            </Button>
          )}
          {prevResponse ? (
            <View>
              <Text style={{ marginTop: "15%" }}>
                Check Previous Responses by Date
              </Text>
              {Object.entries(responseDates).map((key) => (
                <Button
                  key={key[1]}
                  mode="contained"
                  onPress={() => {
                    setDateCheck(key[1]);
                    setCurrentScreen("Check");
                  }}
                >
                  {key[1]}
                </Button>
              ))}
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  picture: {
    top: "25%",
    alignItems: "center",
    gap: 35,
  },
  logout: {
    position: "relative",
    top: 5,
    right: 5,
  },
});
export default ProfileView;
function then(arg0: () => void) {
  throw new Error("Function not implemented.");
}

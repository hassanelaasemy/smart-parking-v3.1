import React, { useState, useEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import marker from "../assets/images/marker.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import ParkingCallout from "../components/ParkingCallout";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useRef } from "react";
const { width } = Dimensions.get("window");
const MapScreen = () => {
  const [Parking, setParking] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [isActive, setisActive] = useState(false);

  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(null);
  const [locationPermissionError, setLocationPermissionError] = useState(null);
  const googlePlacesRef = useRef(null);
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermissionGranted(true);
        getLocation();
      } else {
        setLocationPermissionGranted(false);
      }
    } catch (error) {
      console.log(error);
      setLocationPermissionGranted(false);
    }
  };
  const getLocation = async () => {
    if (!locationPermissionGranted) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync();
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setLocationPermissionError(null);
          setLocationPermissionGranted(true);
          setisActive(true);
        } else {
          setLocationPermissionError("NOLOCATION");
          setLocationPermissionGranted(false);
        }
      } catch (error) {
        console.log(error);
        setLocationPermissionError("NOLOCATION");
        setLocationPermissionGranted(false);
      }
    }
  };
  useEffect(() => {
    getLocation();
  }, [isActive]);
  useEffect(() => {
    const parkingdata = {
      metaData: {},
      listParking: {
        country: "MAROC",
        city: "Casablanca",
      },
      timeStamps: Date.now(),
    };
    AsyncStorage.getItem("accessToken")
      .then((accees) => {
        axios
          .post("http://54.193.180.3:8080/v2/parking/byCity", parkingdata, {
            headers: {
              Authorization: `Bearer ${accees ? accees : ""}`,
            },
          })
          .then((response) => {
            setParking(response.data);
          })
          .catch((errorMsg) => {
            console.log(errorMsg);
            setReload(true);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch();
  }, []);
  const handleMarkerPress = (parking) => {
    setSelectedParking(parking);
  };
  return (
    <View style={styles.container}>
      {locationPermissionError === "NOLOCATION" ? (
        <View style={styles.errorContainer}>
          <Image
            source={require("../assets/images/comic.png")}
            style={{ width: 180, height: 130 }}
          />
          <Text style={styles.errorText}>
            Bienvenue ! Activez votre{" "}
            <View>
              <Text onPress={getLocation} style={styles.buttonText}>
                {" "}
                Localisation{" "}
              </Text>
            </View>
            pour trouver des parkings à proximité. Utilisez la{" "}
            <View>
              <Text
                onPress={() => googlePlacesRef.current?.focus()}
                style={styles.buttonText}
              >
                {" "}
                Recherche{" "}
              </Text>
            </View>
            pour des options spécifiques.
          </Text>
        </View>
      ) : currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            longitudeDelta: 0.009,
            latitudeDelta: 0.009,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          ></Marker>
          {Parking.map((parkingLocation) => (
            <Marker
              key={parkingLocation.id}
              title={parkingLocation?.name}
              coordinate={{
                latitude: parkingLocation.lat,
                longitude: parkingLocation.lng,
              }}
              onPress={() => handleMarkerPress(parkingLocation)}
            >
              <Image source={marker} style={{ width: 40, height: 40 }} />
              <Callout>
                <ParkingCallout
                  name={parkingLocation?.name}
                  price={parkingLocation?.price}
                  rating={parkingLocation?.rating}
                  capacity={parkingLocation?.capacity}
                />
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          size="small"
          color={COLORS.second}
        />
      )}
      <View style={styles.header}>
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Cherche ici..."
          clearButtonMode="always"
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
            setCurrentLocation(null);
            setCurrentLocation({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
            setLocationPermissionError(null);
          }}
          query={{
            key: "AIzaSyBwqCCHiuZJJDAnxKiqWSDWzW5m8ty6QCc",
            language: "en",
          }}
          onFail={(error) => console.log(error)}
          renderLeftButton={() => (
            <View style={styles.iconContainer}>
              <Icon
                name="search"
                size={30}
                color={COLORS.second}
                onPress={() => googlePlacesRef.current?.focus()}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 40,
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: width - 48,
    padding: 4,
    margin: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  errorText: {
    color: COLORS.black,
    textAlign: "center",
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
  },
  input: {
    fontSize: 18,
    color: COLORS.black,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  buttonText: {
    color: COLORS.second,
    fontFamily: FONTS.bold,
  },
});

export default React.memo(MapScreen);

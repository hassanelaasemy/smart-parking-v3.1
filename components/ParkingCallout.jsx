import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import { COLORS, FONTS } from "../constants/theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Svg, Image as ImageSvg } from "react-native-svg";

const ParkingCallout = ({ name, price, rating, capacity }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          elevation: 3, // Add elevation to create a shadow effect
          backgroundColor: COLORS.white,
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 15,
        }}
      >
        <View
          style={[
            {
              flexDirection: "row",
              backgroundColor: COLORS.white,
              borderRadius: 18,
              width: 260,
            },
          ]}
        >
          <View
            style={{
              width: "48%",
              paddingHorizontal: 8,
              paddingVertical: 5,
            }}
          >
            <View>
              <Svg
                style={{
                  width: "100%",
                  height: 100,
                }}
              >
                <ImageSvg
                  width={"100%"}
                  height={"100%"}
                  href={require("../assets/images/parking3.jpg")}
                />
              </Svg>
            </View>
          </View>

          <View style={{ paddingRight: 15, paddingVertical: 15 }}>
            <TouchableOpacity
              onPress={() => navigate && navigation.navigate(navigate)}
            >
              <Text
                style={{
                  ...FONTS.h6,
                  color: colors.title,
                  marginBottom: 3,
                  fontFamily: FONTS.regular,
                }}
              >
                {name}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.second,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                  marginRight: 15,
                }}
              >
                <Text
                  style={{
                    ...FONTS.fontSm,
                    ...FONTS.fontBold,
                    color: COLORS.black,
                  }}
                >
                  {capacity} place
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="star" size={18} color={COLORS.yellow} />

                <Text
                  style={{
                    ...FONTS.fontSm,
                    ...FONTS.fontBold,
                    color: colors.title,
                  }}
                >
                  {rating}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    ...FONTS.fontSm,
                    color: colors.title,
                    marginRight: 3,
                  }}
                >
                  $
                </Text>
                <Text
                  style={{
                    ...FONTS.h6,
                    color: colors.title,
                    lineHeight: 22,
                  }}
                >
                  5 dh
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigate && navigation.navigate("ShoppingCart")}
              ></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default ParkingCallout;

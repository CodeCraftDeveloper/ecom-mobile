import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StepIndicator from "react-native-step-indicator";
import Colors from "../Colors";
// import Colors from "../Colors";

const CustomStepIndicator = ({ currentStep }) => {
  const labels = [
    "Order Placed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        <StepIndicator
          customStyles={indicatorStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={4}
          direction="vertical"
        />
        <View style={styles.linesContainer}>
          {labels.map((_, index) => (
            <View
              key={index}
              style={[
                styles.line,
                index < labels.length - 1 && { height: "100%" },
                index === currentStep && styles.activeLine,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default CustomStepIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  linesContainer: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 2, // Width of the line
    backgroundColor: Colors.lightGrey,
    zIndex: 1,
  },
  line: {
    height: "25%", // Adjust height for spacing
    backgroundColor: Colors.lightGrey,
    position: "absolute",
    left: "50%",
  },
  activeLine: {
    backgroundColor: Colors.green,
  },
});

// Custom styles for StepIndicator
const indicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 35,
  stepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.green,
  stepStrokeFinishedColor: Colors.green,
  stepStrokeUnFinishedColor: Colors.lightGrey,
  currentStepIndicatorColor: Colors.green,
  stepIndicatorFinishedColor: Colors.green,
  stepIndicatorUnFinishedColor: Colors.lightGrey,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: Colors.white,
  stepIndicatorLabelFinishedColor: Colors.white,
  stepIndicatorLabelUnFinishedColor: Colors.white,
};

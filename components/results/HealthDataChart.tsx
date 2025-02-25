import { DateAndValue } from "../../types/Results";
import { surveyQuestions } from "../../utilities/constants";
import { StyleSheet, View } from "react-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import { graphColors } from "../../style/GraphStyles";
import inter from "../../assets/Inter-Medium.ttf";
import React, { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { Dialog, IconButton, Portal, Text } from "react-native-paper";
import Legend from "./Legend";
import { QualToQuantResponse } from "../../types/apiResponses";
import { isVariableId } from "../../types/Profile";
import { VictoryChart, VictoryLine } from "victory";

type Props = {
  label: string;
  data: DateAndValue[];
  numPoints: number;
  qualToQuant: QualToQuantResponse;
};

const HealthDataChart = ({ label, data, numPoints, qualToQuant }: Props) => {
  const [tooltip, setToolTip] = useState({ x: -1, y: -1 });
  const variableQuery = surveyQuestions.filter((v) => v.variableId === label);
  const variable = variableQuery.length > 0 ? variableQuery[0] : null;
  const [visible, setVisible] = useState(false);
  type YKey = "value" | "mean";
  const yKeys = ["value"].concat(variable ? ["mean"] : []) as YKey[];

  const dataPoints = data.slice(0, numPoints).map((datum) => ({
    date: datum.date.valueOf(),
    value: datum.value,
    mean: variable?.mean || -1,
  }));
  const font = useFont(inter, 12);
  // const { isActive: chartPressActive, state: chartPressState } =
  //   Victory.useChartPressState({
  //     x: dataPoints[0].date,
  //     y: {
  //       value: dataPoints[0].value,
  //       mean: variable?.mean || -1,
  //     },
  //   });

  const formatDate = (dateValue: number) => {
    const date = new Date(dateValue);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const toQualitative = (value: number) => {
    if (!(isVariableId(label) && variable)) {
      return "";
    }
    const q2q = qualToQuant[label];

    if (!q2q) {
      return "";
    }
    let qual = variable.qualitativeOptions[0];
    for (const i of Object.keys(q2q).sort()) {
      const index = parseInt(i);
      const current_quant = q2q[index];
      if (current_quant > value) {
        return qual;
      } else {
        qual = variable.qualitativeOptions[index];
      }
    }
    return qual;
  };

  // useEffect(() => {
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // }, [chartPressActive]);

  // useAnimatedReaction(
  //   () => {
  //     return {
  //       x: chartPressState.x.value.value,
  //       y: chartPressState.y.value.value.value,
  //     };
  //   },
  //   ({ x, y }) => {
  //     runOnJS(setToolTip)({ x, y });
  //   },

  //   [chartPressState.x, chartPressState.y]
  // );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.chartTitle}>{variable?.prettyName || label}</Text>
          <IconButton
            style={styles.helpButton}
            icon="help-rhombus"
            onPress={() => setVisible(true)}
          />
        </View>
        {/* <View style={styles.graphInfo}>
          {chartPressActive ? (
            <Text variant="titleMedium">
              {formatDate(tooltip.x)} : {tooltip.y.toFixed(2)}{" "}
              {isVariableId(label) && toQualitative(tooltip.y)
                ? ` - ${toQualitative(tooltip.y)}`
                : ""}
            </Text>
          ) : (
            <></>
          )}
        </View> */}
        <View style={styles.chartContainer}>
          <VictoryChart>
            <VictoryLine></VictoryLine>
          </VictoryChart>
        </View>

        <Legend
          labels={[
            { label: variable?.prettyName || label, color: graphColors.var },
            ...(variable
              ? [{ label: "Population Mean", color: graphColors.mean }]
              : []),
          ]}
        />
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Icon icon="help-rhombus" />
          <Dialog.Title style={styles.title}>Graph Discription</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {variable?.prettyName || "survival"}{" "}
            </Text>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "70%",
    marginBottom: 20,
  },
  chartContainer: {
    height: 200,
  },
  chartTitle: {
    alignSelf: "center",
    fontSize: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignContent: "center",
  },
  helpButton: {
    marginRight: 0,
    marginLeft: "auto",
  },
  graphInfo: {
    height: 24,
  },
});

export default HealthDataChart;

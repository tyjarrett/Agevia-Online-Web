import { View } from "react-native-web";
import { QualToQuantResponse } from "../../types/apiResponses";
import { DateAndValue } from "../../types/Results";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { surveyQuestions } from "../../utilities/constants";
import { Button, Dialog, IconButton, Portal, Text } from "react-native-paper";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
  VictoryVoronoiContainer,
} from "victory";
import { graphColors } from "../../style/GraphStyles";

type Props = {
  label: string;
  data: DateAndValue[];
  numPoints: number;
  qualToQuant: QualToQuantResponse;
};

const WebHealthDataChart = ({ label, data, numPoints, qualToQuant }: Props) => {
  const variableQuery = surveyQuestions.filter((v) => v.variableId === label);
  const variable = variableQuery.length > 0 ? variableQuery[0] : null;
  type YKey = "value" | "mean";
  const yKeys = ["value"].concat(variable ? ["mean"] : []) as YKey[];
  const [visible, setVisible] = useState(false);

  const dataPoints = data.slice(0, numPoints).map((datum) => ({
    date: datum.date.valueOf(),
    value: datum.value,
    mean: variable?.mean || -1,
  }));

  const formatDate = (dateValue: number) => {
    const date = new Date(dateValue);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {}, []);

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
        <VictoryChart
          minDomain={{ y: 0 }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) =>
                `${formatDate(datum.date)}, ${
                  Math.round(datum.value * 100) / 100
                }`
              }
              voronoiBlacklist={["mean-line"]}
            />
          }
        >
          <VictoryLegend
            data={[
              {
                name: variable?.prettyName || label,
                symbol: { fill: graphColors.var },
              },
              {
                name: "Population Mean",
                symbol: { fill: graphColors.mean },
              },
            ]}
            style={{ labels: { fill: graphColors.axes } }}
            orientation="horizontal"
          />
          <VictoryAxis
            dependentAxis
            tickCount={5}
            style={{
              axis: { stroke: graphColors.axes },
              ticksLabels: { stroke: graphColors.axes, fill: graphColors.axes },
            }}
          ></VictoryAxis>
          <VictoryAxis
            tickCount={4}
            style={{
              axis: { stroke: graphColors.axes },
              ticksLabels: {
                stroke: graphColors.axes,
                fill: graphColors.axes,
              },
            }}
          ></VictoryAxis>
          <VictoryGroup>
            <VictoryLine
              data={dataPoints}
              x={(d) => formatDate(d.date)}
              y="value"
              style={{ data: { stroke: graphColors.var, strokeWidth: 3 } }}
            ></VictoryLine>
            <VictoryLine
              name="mean-line"
              data={dataPoints}
              y="mean"
              style={{ data: { stroke: graphColors.mean, strokeWidth: 3 } }}
            ></VictoryLine>
          </VictoryGroup>
        </VictoryChart>
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={styles.dialog}
          >
            <Dialog.Icon icon="help-rhombus" />
            <Dialog.Title style={styles.title}>Graph Discription</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                {variable?.prettyName || "survival"}{" "}
              </Text>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
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
  dialog: {
    width: "50%",
    alignSelf: "center",
  },
});

export default WebHealthDataChart;

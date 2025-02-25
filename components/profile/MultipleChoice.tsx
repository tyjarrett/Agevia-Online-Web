import { RadioButton, useTheme } from "react-native-paper";
import { SetState } from "../../types/General";
import { StyleSheet, View } from "react-native";

type MultipleChoiceChoice = {
  text: string;
  id: string;
};

type Props = {
  choices: Array<MultipleChoiceChoice>;
  setChoice: SetState<string>;
  choice: string;
};

const MultipleChoice = ({ choices, setChoice, choice }: Props) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    questions: { backgroundColor: theme.colors.surface },
  });
  return (
    <>
      <RadioButton.Group onValueChange={setChoice} value={choice}>
        {choices.map((choice) => (
          <View key={choice.id}>
            <RadioButton.Item
              label={choice.text}
              key={choice.id}
              value={choice.id.toString()}
              style={styles.questions}
            />
          </View>
        ))}
      </RadioButton.Group>
    </>
  );
};

export default MultipleChoice;

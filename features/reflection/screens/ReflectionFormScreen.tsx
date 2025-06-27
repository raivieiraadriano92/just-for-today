import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { createRef, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import PagerView from "react-native-pager-view";
import Animated, { LinearTransition } from "react-native-reanimated";
import {
  ReflectionFormProvider,
  useReflectionFormContext,
} from "../components/ReflectionFormProvider";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

function ReflectionFormScreenContent() {
  const { t } = useTranslation();

  const { payload, setContent } = useReflectionFormContext();

  const refDebounce = useRef<number>(null);

  const refScrollView = useRef<ScrollView>(null);

  const handleOnChangeText = (value: string) => {
    if (refDebounce.current) {
      clearTimeout(refDebounce.current);
    }

    refDebounce.current = setTimeout(() => {
      setContent(value);
    }, 300);
  };

  return (
    <ScrollView
      contentContainerClassName="gap-12 p-6 pt-12"
      onContentSizeChange={() =>
        refScrollView.current?.scrollToEnd({ animated: true })
      }
      ref={refScrollView}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <Text className="text-3xl font-semibold text-text">
          {t(
            "features.reflection.screens.ReflectionFormScreen.ReflectionFormScreenContent.title",
          )}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t(
            "features.reflection.screens.ReflectionFormScreen.ReflectionFormScreenContent.description",
          )}
        </Text>
      </View>
      <View className="flex-1">
        <TextInput
          autoFocus
          className="text-lg font-normal text-text"
          defaultValue={payload.content}
          multiline
          onChangeText={handleOnChangeText}
          onFocus={() =>
            setTimeout(() => {
              refScrollView.current?.scrollToEnd({ animated: true });
            }, 500)
          }
          placeholder={t(
            "features.reflection.screens.ReflectionFormScreen.ReflectionFormScreenContent.inputPlaceholder",
          )}
        />
      </View>
    </ScrollView>
  );
}

function ReflectionFormScreenImagePicker() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { payload, setImages } = useReflectionFormContext();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([result.assets[0].uri]);
    }
  };

  return (
    <ScrollView
      contentContainerClassName="gap-12 p-6 pt-12"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-3">
        <Text className="text-3xl font-semibold text-text">
          {t(
            "features.reflection.screens.ReflectionFormScreen.ReflectionFormScreenImagePicker.title",
          )}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t(
            "features.reflection.screens.ReflectionFormScreen.ReflectionFormScreenImagePicker.description",
          )}
        </Text>
      </View>
      <View className="flex-1">
        <InteractivePressable
          className="aspect-square items-center justify-center overflow-hidden rounded-2xl bg-background dark:bg-card"
          onPress={pickImage}
        >
          {payload.images[0] ? (
            <Image
              className="h-full w-full"
              source={{ uri: payload.images[0] }}
            />
          ) : (
            <View className="opacity-10 dark:opacity-30">
              <Ionicons color={theme.colors.text} name="image" size={64} />
            </View>
          )}
        </InteractivePressable>
      </View>
    </ScrollView>
  );
}

const steps = [ReflectionFormScreenContent, ReflectionFormScreenImagePicker];

const pagerViewRef = createRef<PagerView>();

function ReflectionFormScreenStepComponent() {
  const { payload, setStep, step } = useReflectionFormContext();

  useEffect(() => {
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(step);
    }
  }, [step]);

  return (
    <PagerView
      initialPage={0}
      onPageSelected={(e) => setStep(e.nativeEvent.position)}
      orientation="horizontal"
      ref={pagerViewRef}
      scrollEnabled={!!payload.content}
      style={{ flex: 1 }}
    >
      {steps.map((Step, index) => (
        <View key={index} className="flex-1">
          <Step />
        </View>
      ))}
    </PagerView>
  );
}

function ReflectionFormScreenFooterControls() {
  const { t } = useTranslation();

  const { handleNext, step } = useReflectionFormContext();

  return (
    <View className="justify-center border-t-hairline border-border bg-card py-3">
      <Button
        className="self-center"
        label={t(step === steps.length - 1 ? "common.save" : "common.next")}
        onPress={handleNext}
      />
    </View>
  );
}

function ReflectionFormScreenHeaderControls() {
  const { handleBack, step } = useReflectionFormContext();

  const theme = useTheme();

  return (
    <View className="pt-safe bg-card">
      <View className="h-16 flex-row items-center justify-start border-b-hairline border-border px-6">
        <InteractivePressable onPress={handleBack} hitSlop={10}>
          <Ionicons
            color={theme.colors.primary}
            name="chevron-back"
            size={24}
          />
        </InteractivePressable>
      </View>
      <Animated.View
        className="h-0.5 w-10 bg-primary"
        layout={LinearTransition}
        style={{
          width: (WINDOW_WIDTH / steps.length) * (step + 1),
        }}
      />
    </View>
  );
}

export function ReflectionFormScreen() {
  return (
    <ReflectionFormProvider stepsLength={steps.length}>
      <View className="flex-1">
        <ReflectionFormScreenHeaderControls />
        <KeyboardAvoidingView behavior={"padding"} className="flex-1">
          <ReflectionFormScreenStepComponent />
          <ReflectionFormScreenFooterControls />
        </KeyboardAvoidingView>
        <View className="pb-safe bg-card" />
      </View>
    </ReflectionFormProvider>
  );
}

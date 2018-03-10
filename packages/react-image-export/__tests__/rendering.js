import * as path from "path";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import Canvas from "canvas-prebuilt";
import { renderToSvg, renderToCanvas } from "..";

expect.extend({ toMatchImageSnapshot });

const parrot = {
  // snapshotter would output this format, RN has some weird path format
  testUri: path.join(__dirname, "/parrot.png")
};

const settings = {
  width: 640,
  height: 800,
  dpi: 1
};

const renderPng = async jsx => {
  const canvas = new Canvas(settings.width, settings.height);
  const ctx = canvas.getContext("2d");
  await renderToCanvas(ctx, jsx, settings);
  return canvas.toBuffer();
};

test("Render test 1", async () => {
  const jsx = (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        width: 500,
        height: 500
      }}
    >
      {Array.from({ length: 16 }, (_, i) => (
        <View
          key={i}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            margin: 10,
            backgroundColor: "red",
            borderTopWidth: 5,
            borderRightWidth: 10,
            borderBottomWidth: 15,
            borderLeftWidth: 20,
            borderTopColor: "yellow",
            borderRightColor: "green",
            borderBottomColor: "blue",
            borderLeftColor: "magenta",
            borderRadius: 33,
            transform: [{ rotate: `${Math.floor(360 * i / 16)}deg` }]
          }}
        >
          <Text style={{ textAlign: "center" }}>Hello World</Text>
        </View>
      ))}
    </View>
  );

  expect(await renderToSvg(jsx, settings)).toMatchSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Render test 2", async () => {
  const jsx = (
    <View
      style={{
        flex: 1,
        backgroundColor: "#eee",
        justifyContent: "space-between"
      }}
    >
      <View
        style={{
          backgroundColor: "red",
          height: 50,
          transform: [{ scale: 0.5 }, { rotate: "-10deg" }]
        }}
      />
      <View
        style={{
          backgroundColor: "red",
          opacity: 0.66,
          width: 100,
          height: 100
        }}
      >
        <View
          style={{
            backgroundColor: "yellow",
            top: 10,
            left: 10,
            width: 100,
            height: 50
          }}
        />
        <View
          style={{
            backgroundColor: "green",
            opacity: 0.66,
            top: 10,
            left: 10,
            width: 100,
            height: 50
          }}
        >
          <View
            style={{
              backgroundColor: "blue",
              top: 10,
              left: 10,
              width: 100,
              height: 25
            }}
          />
          <View
            style={{
              backgroundColor: "purple",
              opacity: 0.66,
              top: 10,
              left: 10,
              width: 100,
              height: 25
            }}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: "red",
          width: 100,
          height: 100,
          borderRadius: 25,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            top: 50,
            left: 50,
            backgroundColor: "green",
            width: 100,
            height: 100,
            borderRadius: 25
          }}
        />
      </View>
      <Image
        src={parrot}
        style={{ width: "100%", height: 100, aspectRatio: undefined }}
      />
      <Image
        src={parrot}
        resizeMode="cover"
        style={{ width: "100%", height: 100, aspectRatio: undefined }}
      />
      <View
        style={{ height: StyleSheet.hairlineWidth, backgroundColor: "black" }}
      />
      <View>
        <Text>Hello world</Text>
      </View>
    </View>
  );

  expect(await renderToSvg(jsx, settings)).toMatchSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

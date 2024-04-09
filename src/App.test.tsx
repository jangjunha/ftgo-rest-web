import path from "path";

import {
  PactV4,
  MatchersV3,
  SpecificationVersion,
} from "@pact-foundation/pact";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

// Create a 'pact' between the two applications in the integration we are testing
const provider = new PactV4({
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "ftgo-rest-web",
  provider: "ftgo-api-gateway",
  spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
});

describe("GET /restaurants/", () => {
  it("returns an HTTP 200 and a list of restaurants", async () => {
    await provider
      .addInteraction()
      .given("I have a list of restaurants")
      .uponReceiving("a request for all restaurants")
      .withRequest("GET", "/restaurants/")
      .willRespondWith(200, (builder) => {
        builder.headers({ "Content-Type": "application/json" });
        builder.jsonBody(
          MatchersV3.eachLike({
            id: MatchersV3.uuid(),
            name: MatchersV3.string("Nixt Coffee"),
          })
        );
      })
      .executeTest(async (mockserver) => {
        render(<App apiEndpoint={new URL(mockserver.url)} />);

        expect(await screen.findByText("Restaurants:")).toBeInTheDocument();

        const list = await screen.findAllByTestId("restaurant-list");
        expect(list).toMatchSnapshot();
      });
  });
});

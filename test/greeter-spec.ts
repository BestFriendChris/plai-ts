/*
import { Greeter } from "../src/greeter";
import * as chai from "chai";

const expect = chai.expect;

describe("greeter", () => {
  it("should greet with message", () => {
    const greeter = new Greeter("friend");
  });
});
*/

import * as test from "tape";
import { Greeter } from "../src/greeter";

test("greeter should greet with message", (assert) => {
  const greeter = new Greeter("friend");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");

  assert.end();
});

test("greeter should greet with message 2", (assert) => {
  const greeter = new Greeter("friend");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");
  assert.equal(greeter.greet(), "Bonjour, friend!");

  assert.end();
});

import Text "mo:base/Text";

import Float "mo:base/Float";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor Calculator {
  public func calculate(x : Float, y : Float, op : Text) : async Result.Result<Float, Text> {
    switch (op) {
      case "+" { #ok(x + y) };
      case "-" { #ok(x - y) };
      case "*" { #ok(x * y) };
      case "/" {
        if (y == 0) {
          #err("Division by zero")
        } else {
          #ok(x / y)
        }
      };
      case _ { #err("Invalid operation") };
    }
  };

  public func clear() : async () {
    // This function doesn't need to do anything in the backend
    // as the state is managed in the frontend
    Debug.print("Calculator cleared");
  };
}

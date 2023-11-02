import App from "../App";
import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { getInitialValues } from "../api";

describe("Sample Size Field validation", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("Should display error when input is equal or less than 2", async () => {
    fireEvent.change(screen.getByLabelText(/Sample Size/i), {
      target: {
        value: "1",
      },
    });

    await userEvent.click(screen.getByText("Ok"));

    expect(
      screen.getByText("Should be an integer greater than 2")
    ).toBeVisible();
    expect(screen.getByTestId("sample-size-field")).not.toHaveTextContent(
      "This field is required"
    );
  });

  test("Should not display error when input is greater than 2", async () => {
    fireEvent.change(screen.getByLabelText(/Sample Size/i), {
      target: {
        value: "3",
      },
    });

    await userEvent.click(screen.getByText("Ok"));

    expect(
      screen.queryByText("Should be an integer greater than 2")
    ).toBeNull();

    expect(screen.getByTestId("sample-size-field")).not.toHaveTextContent(
      "This field is required"
    );
  });

  test("Should display error when input is empty", async () => {
    fireEvent.change(screen.getByLabelText(/Sample Size/i), {
      target: {
        value: "",
      },
    });

    await userEvent.click(screen.getByText("Ok"));

    expect(screen.getByTestId("sample-size-field")).toHaveTextContent(
      "This field is required"
    );
  });
});

describe("Hypothesis Test field", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("Should be disabled on first load", async () => {
    expect(screen.getByLabelText(/Hypothesized mean/)).toBeDisabled();
  });

  test("Should be denable after toggling the checkbox", async () => {
    await userEvent.click(screen.getByLabelText("Perform hypothesis test"));
    expect(screen.getByLabelText(/Hypothesized mean/)).toBeEnabled();
  });
});

describe("Reset Button", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("Values should be reset after clicking", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Sample Size/i), "130");
    await user.click(screen.getByText("Reset"));
    const { sampleSize } = await getInitialValues();
    expect(screen.getByLabelText(/Sample Size/i)).toHaveValue(sampleSize);
  });
});

describe("Adding Data", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("Correct values should be added to the table", async () => {
    const user = userEvent.setup();

    await waitFor(() =>
      expect(screen.getByLabelText(/Sample Size/i)).toHaveValue(10)
    );
    fireEvent.change(screen.getByLabelText(/Sample Size/i), {
      target: {
        value: "125",
      },
    });
    fireEvent.change(screen.getByLabelText(/Sample Mean/i), {
      target: {
        value: "12.5",
      },
    });
    fireEvent.change(screen.getByLabelText(/Standard Deviation/i), {
      target: {
        value: "0.05",
      },
    });

    await user.click(screen.getByText("Ok"));

    await waitFor(
      () => {
        expect(screen.queryByTestId("table-loader")).toBeVisible();
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByTestId("table-loader")).toBeNull();
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId("data-table")).toHaveTextContent(/125/);
    expect(screen.getByTestId("data-table")).toHaveTextContent(/12.5/);
    expect(screen.getByTestId("data-table")).toHaveTextContent(/0.05/);
  });
});

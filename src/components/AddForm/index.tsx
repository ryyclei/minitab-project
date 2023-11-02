import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getInitialValues } from "../../api";
import FormField from "./FormField";
import type { FormData } from "../../types/FormData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addData } from "../../api";

export default function AddForm() {
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormData>();

  const [hypoSwitch, setHypoSwitch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addDataMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await addData(data);
    },

    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["data"] });
    },
  });

  const resetForm = useCallback(() => {
    (async () => {
      setIsLoading(true);
      const { sampleDeviation, sampleMean, sampleSize } =
        await getInitialValues();
      setValue("sampleSize", sampleSize);
      setValue("sampleMean", sampleMean);
      setValue("sampleDeviation", sampleDeviation);
      setIsLoading(false);
    })();
  }, []);

  const onSubmit = useCallback((data: FormData) => {
    addDataMutation.mutate(data);
  }, []);

  useEffect(() => {
    resetForm();
  }, []);

  return (
    <form
      className="mx-auto mt-16 max-w-xl sm:mt-20"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {(isLoading || addDataMutation.isPending) && (
          <progress className="progress sm:col-span-2 progress-secondary"></progress>
        )}

        <div className="sm:col-span-2" data-testid="sample-size-field">
          <FormField
            label="Sample Size:"
            register={register}
            errors={errors}
            inputProps={{
              type: "number",
              step: "1",
            }}
            name="sampleSize"
            validation={{
              required: "This field is required",
              validate: (value: number) =>
                (Math.round(value) == value && Math.floor(value) > 2) ||
                "Should be an integer greater than 2",
            }}
          />
        </div>

        <div className="sm:col-span-2">
          <FormField
            label="Sample Mean:"
            register={register}
            errors={errors}
            inputProps={{
              type: "number",
              step: "0.01",
            }}
            name="sampleMean"
            validation={{
              required: "This field is required",
            }}
          />
        </div>

        <div className="sm:col-span-2">
          <FormField
            label="Standard Deviation"
            register={register}
            errors={errors}
            inputProps={{
              type: "number",
              step: "0.01",
            }}
            name="sampleDeviation"
            validation={{
              required: "This field is required",
              validate: (value: number) =>
                value > 0 || "Should be an greater than 0",
            }}
          />
        </div>

        <div className="sm:col-span-2">
          <div className="text-sm leading-6">
            <label className="font-medium text-gray-900 flex gap-x-2">
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={(e) => setHypoSwitch(e.target.checked)}
                  checked={hypoSwitch}
                />
              </div>
              Perform hypothesis test
            </label>
          </div>
        </div>

        <div className="sm:col-span-2">
          <FormField
            label="Hypothesized mean:"
            register={register}
            errors={errors}
            inputProps={{
              type: "number",
              step: "0.01",
              disabled: !hypoSwitch,
            }}
            name="hypothesizedMean"
            validation={{
              required: hypoSwitch && "This field is required",
            }}
          />
        </div>
      </div>
      <div className="mt-10">
        <div className="flex justify-end gap-x-1">
          <button className="btn btn-primary" type="submit">
            Ok
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}

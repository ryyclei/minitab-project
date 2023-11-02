import { useQuery } from "@tanstack/react-query";
import { getDataList } from "../api";

export default function DataTable() {
  const {
    data: tableData,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["data"],
    queryFn: getDataList,
  });

  if (isError) return "Error occured";

  return (
    <div>
      <table className="table" data-testid="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Sample Size</th>
            <th>Sample Mean</th>
            <th>Standard Deviation</th>
            <th>Hypothesized mean</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((data, index) => (
            <tr>
              <th>{index + 1}</th>
              <td>{data.sampleSize}</td>
              <td>{data.sampleMean}</td>
              <td>{data.sampleDeviation}</td>
              <td>{data.hypothesizedMean}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFetching && (
        <progress className="progress w-full progress-secondary" data-testid="table-loader"></progress>
      )}
    </div>
  );
}


//Typescript Type for table recieved props
type TableProps = {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;        //recieved function that render differant row for differant table pages
  data: any[];
};

const Table = ({ columns, renderRow, data }: TableProps) => {
    return (
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th key={col.accessor} className={col.className}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    );
  };
  
  export default Table;
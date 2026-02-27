import React from 'react'

type ColumnType = {
  header: string
  accessor: string
  className?: string
}

type TableProps = {
  columns: ColumnType[]
  renderRow: (item: any) => React.ReactNode
  data: any[]
}

const Table = ({ columns, renderRow, data }: TableProps ) => {


  return (
    <table className='w-full mt-4'>
      <thead className=''>
        <tr className='text-left text-gray-500 text-sm '>
          {columns.map((column) => (
            <th key={column.accessor} className={`${column.className || ''}`}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {renderRow && data.map((item, index) => renderRow(item))}
      </tbody>
    </table>
  )
}

export default Table

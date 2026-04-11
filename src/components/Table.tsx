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

if (data.length < 1) {
  return (
    <div className="w-full mt-6">
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-50 text-purple-500 text-2xl mb-3">
          📂
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-700">
          Nothing to show here
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-1 text-center max-w-xs">
          Try adjusting your search or filter options.
        </p>
      </div>
    </div>
  );
}
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

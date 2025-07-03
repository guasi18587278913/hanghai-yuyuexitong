'use client'

import { useState, useTransition } from 'react'
import { Upload } from 'lucide-react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { processAssignments } from '@/app/(dashboard)/admin/matching/actions'

type ProcessResult = {
  success: boolean
  count?: number
  error?: string
}

export function CsvUploader() {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ProcessResult | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResult(null)
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (!file) {
      setResult({ success: false, error: '请先选择一个文件' })
      return
    }

    startTransition(() => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          // Map CSV header to schema expected by the action
          const mappedData = results.data.map((row: any) => ({
            studentName: row['学员姓名'],
            studentWechat: row['学员微信'],
            coachName: row['教练姓名'],
            coachWechat: row['教练微信'],
          }))

          const res = await processAssignments(mappedData)
          setResult(res)
        },
        error: (error: any) => {
          setResult({ success: false, error: 'CSV 文件解析失败: ' + error.message })
        },
      })
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={handleSubmit} disabled={isPending || !file}>
          {isPending ? '正在处理...' : <><Upload className="mr-2 h-4 w-4" /> 上传处理</>}
        </Button>
      </div>
      {result && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            result.success
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {result.success
            ? `成功处理了 ${result.count} 条记录。`
            : `出错了: ${result.error}`}
        </div>
      )}
    </div>
  )
} 
import { ArtifactCode } from './artifact-code'
import { ArtifactPreview } from './artifact-preview'
import { PublishDialog } from './publish-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArtifactSchema } from '@/lib/schema'
import { ExecutionResult } from '@/lib/types'
import { DeepPartial } from 'ai'
import { ChevronsRight, Copy, Download, LoaderCircle } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

export function Preview({
  apiKey,
  selectedTab,
  onSelectedTabChange,
  isLoading,
  artifact,
  result,
  onClose,
}: {
  apiKey: string | undefined
  selectedTab: 'code' | 'artifact'
  onSelectedTabChange: Dispatch<SetStateAction<'code' | 'artifact'>>
  isLoading: boolean
  artifact?: DeepPartial<ArtifactSchema>
  result?: ExecutionResult
  onClose: () => void
}) {
  if (!artifact) {
    return null
  }

  const isLinkAvailable = result?.template !== 'code-interpreter-multilang'

  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y bg-popover h-full w-full overflow-auto">
      <Tabs
        value={selectedTab}
        onValueChange={(value) =>
          onSelectedTabChange(value as 'code' | 'artifact')
        }
        className="h-full flex flex-col items-start justify-start"
      >
        <div className="w-full p-2 grid grid-cols-3 items-center border-b">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={onClose}
                >
                  <ChevronsRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close sidebar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex justify-center">
            <TabsList className="px-1 py-0 border h-8">
              <TabsTrigger
                className="font-normal text-xs py-1 px-2 gap-1 flex items-center"
                value="code"
              >
                {isLoading && (
                  <LoaderCircle
                    strokeWidth={3}
                    className="h-3 w-3 animate-spin"
                  />
                )}
                Code
              </TabsTrigger>
              <TabsTrigger
                disabled={!result}
                className="font-normal text-xs py-1 px-2"
                value="artifact"
              >
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          {result && (
            <div className="flex items-center justify-end gap-2">
              {isLinkAvailable && (
                <PublishDialog
                  url={result.url!}
                  sbxId={result.sbxId!}
                  apiKey={apiKey}
                />
              )}
            </div>
          )}
        </div>
        {artifact && (
          <div className="overflow-y-auto w-full h-full">
            <TabsContent value="code" className="h-full">
              {artifact.code && artifact.file_path && (
                <ArtifactCode
                  files={[
                    {
                      name: artifact.file_path,
                      content: artifact.code,
                    },
                  ]}
                />
              )}
            </TabsContent>
            <TabsContent value="artifact" className="h-full">
              {result && <ArtifactPreview result={result as ExecutionResult} />}
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  )
}

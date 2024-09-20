import { publish } from '@/app/actions/publish'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

export function PublishDialog({ url }: { url: string }) {
  const [publishedURL, setPublishedURL] = useState<string | null>(null)
  useEffect(() => {
    setPublishedURL(null)
  }, [url])

  async function publishURL(url: string) {
    const { url: publishedURL } = await publish(url)
    setPublishedURL(publishedURL)
  }

  function copy(content: string) {
    navigator.clipboard.writeText(content)
    alert('Copied to clipboard')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Publish</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 w-80 flex flex-col gap-2">
        <div className="text-sm font-semibold">Publish fragment</div>
        <div className="text-sm text-muted-foreground">
          Publishing the fragment will make it publicly available to others via
          link.
        </div>
        <div className="flex flex-col gap-2">
          {publishedURL && (
            <div className="flex items-center gap-2">
              <Input value={publishedURL} readOnly />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copy(publishedURL)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button
            variant="default"
            onClick={() => publishURL(url)}
            disabled={publishedURL !== null}
          >
            {publishedURL ? 'Published' : 'Confirm and publish'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

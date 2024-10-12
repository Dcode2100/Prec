import { useEffect, useState } from 'react'
import { ConfigData } from '@/lib/types/configTypes'
import { createConfig, updateConfig } from '@/lib/api/configApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface CreateConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  refetchConfig: () => void
  configData: ConfigData
}

const CreateAndUpdateConfig = ({
  isOpen,
  onClose,
  refetchConfig,
  configData,
}: CreateConfigModalProps): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)

  const [errMsg, setErrMsg] = useState({
    key: '',
    value: '',
  })

  const [state, setState] = useState({
    key: '',
    value: '',
  })

  useEffect(() => {
    if (configData?.key && isOpen) {
      setState({
        key: configData?.key,
        value: configData?.value,
      })
    } else {
      setState({
        key: '',
        value: '',
      })
    }
  }, [configData, isOpen])

  const validatePayload = (payload: any) => {
    const validations = configData?.key
      ? [
          { key: 'key', message: 'Required key' },
          { key: 'value', message: 'Required value' },
        ]
      : [
          { key: 'key', message: 'Required key' },
          { key: 'value', message: 'Required value' },
        ]

    let doesErrorExist = false

    for (const validation of validations) {
      if (payload[validation.key?.toString()] === '') {
        setErrMsg((prev) => {
          return { ...prev, [validation.key?.toString()]: validation.message }
        })
        doesErrorExist = true
      }
    }
    if (!doesErrorExist) {
      setErrMsg({
        key: '',
        value: '',
      })
    }
    return doesErrorExist
  }

  const { toast } = useToast()

  const onSubmit = async (e: any) => {
    setIsLoading(true)
    e.preventDefault()
    const body = {
      key: state?.key,
      value: state?.value,
    }

    if (!validatePayload(state)) {
      try {
        configData?.key ? await updateConfig(body) : await createConfig(body)
        setIsLoading(false)
        toast({
          title: `Config  has been  ${
            configData?.key ? 'updated' : 'created'
          } successfully`,
          variant: 'success',
        })
        refetchConfig()
        handleClose()
      } catch (err: any) {
        setIsLoading(false)
        handleClose()
      }
    } else {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setState({
      key: '',
      value: '',
    })
    setErrMsg({
      key: '',
      value: '',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {configData?.key ? 'Update Config' : 'Create Config'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              name="key"
              value={state.key}
              onChange={(e) => {
                setState({ ...state, key: e.target.value })
                setErrMsg((prev) => ({ ...prev, key: '' }))
              }}
              disabled={configData?.key?.length > 0}
              className="font-semibold"
            />
            {errMsg?.key && (
              <p className="text-red-500 text-sm">{errMsg?.key}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              value={state.value}
              onChange={(e) => {
                setState({ ...state, value: e.target.value })
                setErrMsg((prev) => ({ ...prev, value: '' }))
              }}
              className="font-semibold"
            />
            {errMsg?.value && (
              <p className="text-red-500 text-sm">{errMsg?.value}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {configData?.key ? 'Update Config' : 'Add Config'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateAndUpdateConfig

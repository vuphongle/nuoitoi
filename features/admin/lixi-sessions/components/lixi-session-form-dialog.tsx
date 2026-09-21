'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/components/ui/notification';
import { useCreateLixiSession, useUpdateLixiSession } from '@/hooks/use-lixi-sessions';
import { useI18n } from '@/hooks/useI18n';
import { getApiErrorMessage } from '@/lib/api-error';
import type { LixiSessionItem } from '@/types';
import {
  buildLixiSessionSchema,
  LIXI_SESSION_ACCEPTED_IMAGE_TYPES,
  type LixiSessionFormSchemaValues,
} from '../schemas/lixi-session.schema';
import { ImageCropperDialog } from './image-cropper-dialog';

type CropField = 'qr' | 'avatar';

interface LixiSessionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lixiSession?: LixiSessionItem | null;
}

function usePreviewUrl(file: File | null | undefined) {
  const objectUrl = React.useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  React.useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  return objectUrl;
}

function ImageFileField({
  id,
  label,
  existingUrl,
  previewUrl,
  error,
  onSelectFile,
}: {
  id: string;
  label: string;
  existingUrl?: string;
  previewUrl: string | null;
  error?: string;
  onSelectFile: (file: File | null) => void;
}) {
  const displayUrl = previewUrl || existingUrl;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        className="mt-2 cursor-pointer!"
        id={id}
        type="file"
        accept={LIXI_SESSION_ACCEPTED_IMAGE_TYPES.join(',')}
        error={error}
        onChange={(event) => {
          onSelectFile(event.target.files?.[0] ?? null);
          event.target.value = '';
        }}
      />
      {displayUrl ? (
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-2">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <span className="text-xs text-muted-foreground">
            {previewUrl ? 'Ảnh mới đã chọn' : 'Ảnh hiện tại'}
          </span>
        </div>
      ) : null}
    </div>
  );
}

const emptyValues: Partial<LixiSessionFormSchemaValues> = {
  code: '',
  name: '',
  tagline: '',
  bank: '',
  account: '',
  owner: '',
  content: '',
  sort_order: 0,
  qr: undefined,
  avatar: undefined,
};

function valuesFromLixiSession(item: LixiSessionItem): Partial<LixiSessionFormSchemaValues> {
  return {
    code: item.code,
    name: item.name,
    tagline: item.tagline,
    bank: item.bank,
    account: item.account,
    owner: item.owner,
    content: item.content,
    sort_order: item.sort_order,
    qr: undefined,
    avatar: undefined,
  };
}

export function LixiSessionFormDialog({
  open,
  onOpenChange,
  lixiSession,
}: LixiSessionFormDialogProps) {
  const isEdit = Boolean(lixiSession);
  const { t } = useI18n('lixiSessions');
  const { success, error } = useNotification();
  const schema = React.useMemo(() => buildLixiSessionSchema(isEdit), [isEdit]);

  const form = useForm<LixiSessionFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: lixiSession ? valuesFromLixiSession(lixiSession) : emptyValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    reset(lixiSession ? valuesFromLixiSession(lixiSession) : emptyValues);
  }, [lixiSession, open, reset]);

  const createMutation = useCreateLixiSession({
    onSuccess: () => {
      success('Tạo phiên lì xì thành công!');
      onOpenChange(false);
    },
    onError: (err) => error(getApiErrorMessage(err, 'Có lỗi xảy ra khi tạo phiên lì xì')),
  });

  const updateMutation = useUpdateLixiSession({
    onSuccess: () => {
      success('Cập nhật phiên lì xì thành công!');
      onOpenChange(false);
    },
    onError: (err) => error(getApiErrorMessage(err, 'Có lỗi xảy ra khi cập nhật phiên lì xì')),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const qrFile = watch('qr');
  const avatarFile = watch('avatar');
  const qrPreview = usePreviewUrl(qrFile);
  const avatarPreview = usePreviewUrl(avatarFile);

  const [cropState, setCropState] = React.useState<{
    field: CropField;
    imageSrc: string;
    fileName: string;
  } | null>(null);

  const handleSelectRawFile = (field: CropField, file: File | null) => {
    if (!file) return;
    setCropState({ field, imageSrc: URL.createObjectURL(file), fileName: file.name });
  };

  const handleCropperOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCropState((current) => {
        if (current) URL.revokeObjectURL(current.imageSrc);
        return null;
      });
    }
  };

  const handleCropped = (file: File) => {
    if (!cropState) return;
    setValue(cropState.field, file, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append('code', values.code.trim());
    formData.append('name', values.name.trim());
    formData.append('tagline', values.tagline.trim());
    formData.append('bank', values.bank.trim());
    formData.append('account', values.account.trim());
    formData.append('owner', values.owner.trim());
    formData.append('content', values.content.trim());
    formData.append('sort_order', String(values.sort_order));
    if (values.qr) formData.append('qr', values.qr);
    if (values.avatar) formData.append('avatar', values.avatar);

    if (isEdit && lixiSession) {
      updateMutation.mutate({ id: lixiSession.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-160">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Chỉnh sửa phiên lì xì' : 'Thêm phiên lì xì mới'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 py-2" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lixi-code" required>
                  {t('form.codeLabel')}
                </Label>
                <Input
                  className="mt-2"
                  id="lixi-code"
                  placeholder="TET-2026"
                  error={errors.code?.message}
                  {...register('code')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lixi-name" required>
                  {t('form.nameLabel')}
                </Label>
                <Input
                  className="mt-2"
                  id="lixi-name"
                  placeholder="Lì xì Tết 2026"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lixi-tagline" required>
                {t('form.taglineLabel')}
              </Label>
              <Input
                className="mt-2"
                id="lixi-tagline"
                placeholder="An khang thịnh vượng"
                error={errors.tagline?.message}
                {...register('tagline')}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="lixi-bank" required>
                  {t('form.bankLabel')}
                </Label>
                <Input
                  className="mt-2"
                  id="lixi-bank"
                  placeholder="Vietcombank"
                  error={errors.bank?.message}
                  {...register('bank')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lixi-account" required>
                  {t('form.accountLabel')}
                </Label>
                <Input
                  className="mt-2"
                  id="lixi-account"
                  placeholder="0123456789"
                  error={errors.account?.message}
                  {...register('account')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lixi-owner" required>
                  {t('form.ownerLabel')}
                </Label>
                <Input
                  className="mt-2"
                  id="lixi-owner"
                  placeholder="Nguyễn Minh Huy"
                  error={errors.owner?.message}
                  {...register('owner')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lixi-content" required>
                  {t('form.contentLabel')}
                </Label>
                <Input
                  className="mt-2"
                  id="lixi-content"
                  placeholder="Mung tuoi nam moi 2026"
                  error={errors.content?.message}
                  {...register('content')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lixi-sort-order">{t('form.sortOrderLabel')}</Label>
                <Input
                  className="mt-2"
                  id="lixi-sort-order"
                  type="number"
                  min={0}
                  error={errors.sort_order?.message}
                  {...register('sort_order', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ImageFileField
                id="lixi-qr"
                label={isEdit ? t('form.qrEditLabel') : t('form.qrCreateLabel')}
                existingUrl={lixiSession?.qr}
                previewUrl={qrPreview}
                error={errors.qr?.message as string | undefined}
                onSelectFile={(file) => handleSelectRawFile('qr', file)}
              />
              <ImageFileField
                id="lixi-avatar"
                label={isEdit ? t('form.avatarEditLabel') : t('form.avatarCreateLabel')}
                existingUrl={lixiSession?.avatar}
                previewUrl={avatarPreview}
                error={errors.avatar?.message as string | undefined}
                onSelectFile={(file) => handleSelectRawFile('avatar', file)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                {isEdit ? 'Lưu thay đổi' : 'Tạo phiên lì xì'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ImageCropperDialog
        key={cropState?.imageSrc ?? 'empty'}
        open={!!cropState}
        imageSrc={cropState?.imageSrc ?? null}
        fileName={cropState?.fileName ?? 'image.png'}
        onOpenChange={handleCropperOpenChange}
        onCropped={handleCropped}
      />
    </>
  );
}

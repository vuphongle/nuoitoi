'use client';

import * as React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotification } from '@/components/ui/notification';
import { useCreateUser, useUpdateUser } from '@/hooks/use-users';
import type { UserItem } from '@/types';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserItem | null;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: UserFormDialogProps) {
  const { success, error } = useNotification();
  const isEdit = Boolean(user);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [birthDay, setBirthDay] = React.useState('');
  const [gender, setGender] = React.useState('male');
  const [role, setRole] = React.useState('user');
  const [avatar, setAvatar] = React.useState('');

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword('');
      setPhone(user.phone || '');
      setBirthDay(user.birth_day || '');
      setGender(user.gender?.toLowerCase() || 'male');
      setRole(user.role?.toLowerCase() || 'user');
      setAvatar(user.avatar || '');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setBirthDay('');
      setGender('male');
      setRole('user');
      setAvatar('');
    }
  }, [user, open]);

  const createMutation = useCreateUser({
    onSuccess: () => {
      success('Tạo người dùng mới thành công!');
      onOpenChange(false);
    },
    onError: (err: any) => {
      error(
        err?.response?.data?.message ||
          err?.message ||
          'Có lỗi xảy ra khi tạo người dùng'
      );
    },
  });

  const updateMutation = useUpdateUser({
    onSuccess: () => {
      success('Cập nhật thông tin người dùng thành công!');
      onOpenChange(false);
    },
    onError: (err: any) => {
      error(
        err?.response?.data?.message ||
          err?.message ||
          'Có lỗi xảy ra khi cập nhật người dùng'
      );
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      error('Vui lòng nhập họ và tên');
      return;
    }
    if (!email.trim()) {
      error('Vui lòng nhập địa chỉ email');
      return;
    }
    if (!isEdit && !password.trim()) {
      error('Vui lòng nhập mật khẩu cho người dùng mới');
      return;
    }

    const payload: Record<string, any> = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      birth_day: birthDay.trim() || undefined,
      gender,
      role,
      avatar: avatar.trim() || undefined,
    };

    if (password.trim()) {
      payload.password = password.trim();
    }

    if (isEdit && user) {
      updateMutation.mutate({
        id: user.id,
        payload,
      });
    } else {
      createMutation.mutate(payload as any);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm mới người dùng'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-name"
                placeholder="vd: Nguyễn Minh Huy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-password">
                Mật khẩu {!isEdit && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="user-password"
                type="password"
                placeholder={isEdit ? 'Để trống nếu không đổi' : 'Nhập mật khẩu...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isEdit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-phone">Số điện thoại</Label>
              <Input
                id="user-phone"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Birthday, Gender, Role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-birthday">Ngày sinh</Label>
              <Input
                id="user-birthday"
                type="date"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-gender">Giới tính</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="user-gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam (Male)</SelectItem>
                  <SelectItem value="female">Nữ (Female)</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">Vai trò</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Người dùng (User)</SelectItem>
                  <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Avatar URL & Live Preview */}
          <div className="space-y-2">
            <Label htmlFor="user-avatar">URL Ảnh đại diện (Avatar)</Label>
            <Input
              id="user-avatar"
              placeholder="https://example.com/avatar.jpg"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            {avatar && (
              <div className="mt-2 flex items-center gap-3 p-2 border border-border rounded-lg bg-muted/20">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-border shrink-0 bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatar}
                    alt="Preview avatar"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  Xem trước ảnh đại diện
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Đang lưu...'
                : isEdit
                ? 'Lưu thay đổi'
                : 'Tạo người dùng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

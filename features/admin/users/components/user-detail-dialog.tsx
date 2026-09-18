'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, User as UserIcon, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import type { UserItem } from '@/types';

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
}

export function UserDetailDialog({
  open,
  onOpenChange,
  user,
}: UserDetailDialogProps) {
  if (!user) return null;

  const getGenderLabel = (g?: string) => {
    if (!g) return '—';
    const lower = g.toLowerCase();
    if (lower === 'male') return 'Nam';
    if (lower === 'female') return 'Nữ';
    return 'Khác';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* User Header Profile */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0 border border-border">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-primary" />
              )}
            </div>

            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {user.name}
                </h3>
                <Badge
                  variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                  className="capitalize text-xs font-semibold"
                >
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" /> User
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {user.email}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">ID Người dùng:</span>
              <span className="font-mono text-foreground font-medium">#{user.id}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Số điện thoại:</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                {user.phone || '—'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Giới tính:</span>
              <span className="font-medium text-foreground">
                {getGenderLabel(user.gender)}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Ngày sinh:</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                {user.birth_day || '—'}
              </span>
            </div>

            <div className="space-y-1 col-span-2">
              <span className="text-xs text-muted-foreground block">Ngày tham gia hệ thống:</span>
              <span className="text-foreground text-xs">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString('vi-VN')
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// src/user/entities/user.entity.ts
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Contract } from 'src/contract/entities/contract.entity';
import { NotificationSettings } from 'src/notification-settings/entities/notification-settings.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { Post } from 'src/post/entities/post.entity';
import { AuditLog } from '@src/audit/entitites/audit-log.entity';
import { Report } from '@src/reporting/entities/report.entity';
import { Content } from '@src/content/entities/content.entity';
import { Connection } from '@src/connection/entities/connection.entity';
import { ConnectionNotification } from '@src/notifications/entities/connection-notification.entity';
import { Reputation } from '@src/reputation/Reputation.entity';

@Entity('users')
@Index(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => Reputation, (reputation) => reputation.user, { cascade: true })
  reputation: Reputation;

  @Column({ unique: true, nullable: true })
  @Length(3, 20)
  username?: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  password: string;

  @Column({ unique: true, nullable: true })
  @IsNotEmpty()
  walletAddress?: string;

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts?: Contract[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments?: Payment[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
  @OneToMany(() => NotificationSettings, (notification) => notification.user)
  notificationSettings: NotificationSettings[];

  @IsBoolean()
  isEmailVerified: boolean;

  @IsString()
  emailTokenVerification?: string;

  @IsBoolean()
  resetToken: string;

  @IsDate()
  tokenExpires: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToOne(
    () => FreelancerProfile,
    (freelancerProfile) => freelancerProfile.user,
    { cascade: true },
  )
  freelancerProfile?: FreelancerProfile;

  @OneToMany(() => Connection, (connection) => connection.requester)
  sentConnections: Connection[];

  @OneToMany(() => Connection, (connection) => connection.recipient)
  receivedConnections: Connection[];

  @OneToMany(
    () => ConnectionNotification,
    (notification) => notification.user,
    {
      cascade: true,
    },
  )
  notifications: Notification[];

  @Column({ default: 'public' })
  connectionPrivacy: string;

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Report, (report) => report.reporter)
  reports: Report[];

  @OneToMany(() => Content, (content) => content.creator) // Ensure this matches the Content relationship
  content: Content[];
}

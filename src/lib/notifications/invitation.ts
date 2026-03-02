import { sendEmailViaResend } from "./email";

type InvitationEmailInput = {
  to: string;
  organizationName: string;
  inviterEmail: string;
  signupUrl: string;
};

type ExistingUserInvitationEmailInput = {
  to: string;
  organizationName: string;
  inviterEmail: string;
  dashboardUrl: string;
};

export async function sendInvitationEmail(input: InvitationEmailInput) {
  const subject = `【請求受取太郎】${input.organizationName}への招待`;
  const text = [
    `${input.inviterEmail} さんから「${input.organizationName}」への招待が届いています。`,
    "",
    "以下のリンクからアカウントを作成すると、自動的に組織に参加できます。",
    "",
    input.signupUrl,
    "",
    "※ このリンクの有効期限は7日間です。",
  ].join("\n");
  const html = `
    <p>${input.inviterEmail} さんから「<strong>${input.organizationName}</strong>」への招待が届いています。</p>
    <p>以下のリンクからアカウントを作成すると、自動的に組織に参加できます。</p>
    <p><a href="${input.signupUrl}">${input.signupUrl}</a></p>
    <p style="color: #666; font-size: 14px;">※ このリンクの有効期限は7日間です。</p>
  `;

  await sendEmailViaResend({ to: [input.to], subject, text, html });
}

export async function sendExistingUserInvitationEmail(
  input: ExistingUserInvitationEmailInput
) {
  const subject = `【請求受取太郎】${input.organizationName}への招待`;
  const text = [
    `${input.inviterEmail} さんから「${input.organizationName}」への招待が届いています。`,
    "",
    "ダッシュボードにログインして、招待を確認してください。",
    "",
    input.dashboardUrl,
    "",
    "※ このリンクの有効期限は7日間です。",
  ].join("\n");
  const html = `
    <p>${input.inviterEmail} さんから「<strong>${input.organizationName}</strong>」への招待が届いています。</p>
    <p>ダッシュボードにログインして、招待を確認してください。</p>
    <p><a href="${input.dashboardUrl}">${input.dashboardUrl}</a></p>
    <p style="color: #666; font-size: 14px;">※ このリンクの有効期限は7日間です。</p>
  `;

  await sendEmailViaResend({ to: [input.to], subject, text, html });
}

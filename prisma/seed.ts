import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// FULLSAIL コーポレートサイトのお知らせ(Information)を再現するサンプルデータ。
// 本番の実データ移行は行わず、予行演習用のダミーとして投入する。
const samplePosts = [
  {
    title: "株式会社FULLSAILを設立しました",
    body: "株式会社FULLSAILを設立いたしました。\n\nマーケティングソリューション企業として、貴社のマーケティング課題の解決に貢献してまいります。今後ともよろしくお願いいたします。",
    publishedAt: new Date("2021-05-13T11:00:00+09:00"),
  },
  {
    title: "マーケティングコンサルティングサービスを開始しました",
    body: "マーケティングコンサルティングサービスの提供を開始いたしました。\n\n課題の整理から施策の設計・実行まで、データに基づいて伴走支援いたします。まずはお気軽にお問い合わせください。",
    publishedAt: new Date("2021-09-01T10:00:00+09:00"),
  },
  {
    title: "ロングCPE広告・ASO支援のご提供を開始しました",
    body: "アプリ事業者さま向けに、ロングCPE広告およびASO(アプリストア最適化)支援の提供を開始いたしました。\n\nインストール後の継続率やストア内の可視性の改善まで、一気通貫でサポートいたします。",
    publishedAt: new Date("2022-03-15T10:00:00+09:00"),
  },
  {
    title: "採用を開始しました(マーケター・エンジニア)",
    body: "事業拡大にともない、マーケターおよびエンジニアの採用を開始いたしました。\n\nFULLSAIL のミッションに共感し、成果にこだわって挑戦したい方からのご応募をお待ちしています。",
    publishedAt: new Date("2023-06-01T10:00:00+09:00"),
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("admin1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "管理者",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("初期管理者を作成しました:", admin.email);

  // 既存の投稿が無いときだけサンプルを投入(再実行での重複を避ける)
  const existing = await prisma.post.count();
  if (existing === 0) {
    for (const post of samplePosts) {
      await prisma.post.create({
        data: {
          title: post.title,
          body: post.body,
          published: true,
          publishedAt: post.publishedAt,
          authorId: admin.id,
        },
      });
    }
    console.log(`サンプルのお知らせを${samplePosts.length}件作成しました`);
  } else {
    console.log(`既存の投稿が${existing}件あるため、サンプル投入はスキップしました`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

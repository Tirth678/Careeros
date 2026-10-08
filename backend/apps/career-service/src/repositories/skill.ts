import { prisma } from "@careeros/database";

export const skillRepository = {
  /**
   * Roadmap tasks reference skills by name. Skills are owned by the profile
   * domain, so we only *link* to skills that already exist — anything the
   * model invents simply stays unlinked (`skillId: null`).
   */
  async findIdsByNames(names: (string | null | undefined)[]): Promise<Map<string, string>> {
    const unique = [
      ...new Set(
        names
          .map((n) => n?.trim())
          .filter((n): n is string => Boolean(n && n.length > 0)),
      ),
    ];

    if (unique.length === 0) return new Map();

    const rows = await prisma.skill.findMany({
      where: { name: { in: unique } },
      select: { id: true, name: true },
    });

    return new Map(rows.map((row) => [row.name.toLowerCase(), row.id]));
  },
};

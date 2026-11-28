import type { IFullStoryResponse } from "@/games/relic-expedition/types";
import type { ContentLanguageType } from "@/types/llm";

export const sampleStories: Record<ContentLanguageType, IFullStoryResponse> = {
  English: {
    overallTheme: "The Tidekeeper's Vault",
    intro: "A retreating tide reveals the stairway to a vault where the Jade Compass was hidden.",
    rounds: [
      {
        round: 1,
        location: "Tidal Gate",
        sceneSummary: "The gate reads: ‘Only the moon leads the sea.’ A sun lever and a moon lever flank the arch.",
        intro: "Wet steps end at an iron gate. A sun lever and a moon lever flank the arch. Between them, an inscription reads: ‘Only the moon leads the sea.’",
        narrativeState: {
          location: "Tidal Gate",
          status: "Safe on the steps while the tide is out.",
          shortStatus: "Safe at low tide",
          initItems: ["Rope"],
        },
        choices: [
          {
            id: "moon",
            title: "Pull the Moon Lever",
            summary: "Lower the lever marked with a crescent.",
            isCorrect: true,
            consequence: "The moon lever releases the gate. You tie your rope to the rail and lower yourself into the vault.",
            finalItems: [],
          },
          {
            id: "sun",
            title: "Pull the Sun Lever",
            summary: "Lower the lever marked with a sunburst.",
            isCorrect: false,
            consequence: "The sun lever opens the seaward sluice. The returning tide sweeps you out and seals the stairway.",
            finalItems: ["Rope"],
          },
        ],
      },
      {
        round: 2,
        location: "Compass Chamber",
        sceneSummary: "The Jade Compass rests on an ivory plate. A relief shows a keeper lifting the compass while leaving an equal weight in its place.",
        intro: "The Jade Compass rests on an ivory plate beside a brass counterweight. A relief shows a keeper lifting the compass while leaving an equal weight in its place.",
        narrativeState: {
          location: "Compass Chamber",
          status: "Inside the vault with a rope secured at the entrance.",
          shortStatus: "In the vault",
          initItems: [],
          storyProgress: "Opened the Tidal Gate.",
        },
        choices: [
          {
            id: "lift",
            title: "Lift the Compass",
            summary: "Take the compass directly off the plate.",
            isCorrect: false,
            consequence: "The empty plate rises and drops a barred cage. The compass is trapped inside as the vault fills.",
            finalItems: [],
          },
          {
            id: "swap",
            title: "Swap in the Counterweight",
            summary: "Slide the brass weight onto the plate as you lift the compass.",
            isCorrect: true,
            consequence: "The plate stays level and the cage remains raised. You take the Jade Compass and climb out before the tide turns.",
            finalItems: ["Jade Compass"],
          },
        ],
      },
    ],
  },
  Vietnamese: {
    overallTheme: "Kho báu dưới chân triều",
    intro: "Nước triều rút, để lộ bậc thang dẫn xuống hầm cất giữ La Bàn Ngọc.",
    rounds: [
      {
        round: 1,
        location: "Cổng Thủy Triều",
        sceneSummary: "Trên cổng khắc dòng chữ ‘Chỉ trăng mới dẫn lối cho biển’. Hai bên vòm cổng có cần gạt hình mặt trời và hình trăng.",
        intro: "Những bậc thang ướt dẫn đến cổng sắt. Hai cần gạt mang dấu mặt trời và trăng lưỡi liềm. Giữa chúng là dòng chữ ‘Chỉ trăng mới dẫn lối cho biển’.",
        narrativeState: {
          location: "Cổng Thủy Triều",
          status: "Bạn đang đứng an toàn trên bậc thang khi nước triều rút.",
          shortStatus: "An toàn khi triều rút",
          initItems: ["Dây thừng"],
        },
        choices: [
          {
            id: "moon",
            title: "Gạt cần hình trăng",
            summary: "Hạ cần gạt có dấu trăng lưỡi liềm.",
            isCorrect: true,
            consequence: "Cần hình trăng mở cổng. Bạn buộc dây vào lan can rồi đu xuống hầm.",
            finalItems: [],
          },
          {
            id: "sun",
            title: "Gạt cần hình mặt trời",
            summary: "Hạ cần gạt có dấu mặt trời.",
            isCorrect: false,
            consequence: "Cần hình mặt trời mở cửa dẫn nước biển. Dòng nước cuốn bạn ra ngoài rồi cổng sập xuống, chặn lối vào.",
            finalItems: ["Dây thừng"],
          },
        ],
      },
      {
        round: 2,
        location: "Phòng La Bàn",
        sceneSummary: "La Bàn Ngọc nằm trên một đĩa ngà. Phù điêu khắc cảnh người giữ hầm nhấc la bàn và đặt một vật nặng tương đương vào chỗ cũ.",
        intro: "La Bàn Ngọc nằm trên đĩa ngà, cạnh một quả cân bằng đồng. Phù điêu trên tường khắc cảnh người giữ hầm nhấc la bàn và đặt một vật nặng tương đương vào chỗ cũ.",
        narrativeState: {
          location: "Phòng La Bàn",
          status: "Bạn đã vào hầm. Dây thừng vẫn buộc ở lối vào.",
          shortStatus: "Đã vào hầm",
          initItems: [],
          storyProgress: "Đã mở Cổng Thủy Triều.",
        },
        choices: [
          {
            id: "lift",
            title: "Nhấc la bàn lên",
            summary: "Lấy la bàn ra khỏi đĩa ngà.",
            isCorrect: false,
            consequence: "Đĩa ngà bật lên, kéo sập lồng sắt. La bàn mắc kẹt bên trong khi nước tràn vào hầm.",
            finalItems: [],
          },
          {
            id: "swap",
            title: "Đặt quả cân thay thế",
            summary: "Đẩy quả cân đồng lên đĩa ngà cùng lúc nhấc la bàn.",
            isCorrect: true,
            consequence: "Đĩa ngà giữ thăng bằng nên lồng sắt không rơi. Bạn mang La Bàn Ngọc leo ra ngoài trước khi nước triều dâng.",
            finalItems: ["La Bàn Ngọc"],
          },
        ],
      },
    ],
  },
};

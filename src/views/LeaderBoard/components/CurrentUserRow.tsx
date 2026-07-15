import { Box } from "@mui/material";

import { LeaderboardUser } from "../constants";
import { formatNumber } from "@/helpers";

interface Props {
    user: LeaderboardUser;
    rowHeight?: number;
}

export default function CurrentUserRow({
    user,
    rowHeight = 54,
}: Props) {
    return (
        <></>
        // <Box
        //     sx={{
        //         borderBottom: "1px solid #EEF0F3",
        //     }}
        // >
        //     <Box
        //         sx={{
        //             display: "grid",
        //             gridTemplateColumns:
        //                 "80px minmax(260px, 1fr) 180px 120px 160px",
        //             alignItems: "center",
        //             height: rowHeight,
        //             background: "#EFF6FF",
        //         }}
        //     >
        //         <Box
        //             sx={{
        //                 fontWeight: 700,
        //                 color: "#003EC7",
        //                 fontSize: 18,
        //                 fontFamily: 'var(--font-jetBrain-mono)',
        //                 paddingLeft: '15px'
        //             }}
        //         >
        //             {user.rank}
        //         </Box>

        //         <Box
        //             sx={{
        //                 px: 2,
        //                 display: "flex",
        //                 alignItems: "center",
        //                 gap: 1,
        //                 fontWeight: 700,
        //                 color: "#003EC7",
        //                 fontSize: 16,
        //             }}
        //         >
        //             {user.contributor}

        //             <Box
        //                 sx={{
        //                     bgcolor: "#003EC7",
        //                     color: "#FFF",
        //                     fontSize: 9,
        //                     fontWeight: 700,
        //                     px: .8,
        //                     py: .2,
        //                     borderRadius: "4px",
        //                 }}
        //             >
        //                 YOU
        //             </Box>
        //         </Box>

        //         <Box
        //             sx={{
        //                 px: 2,
        //                 display: "flex",
        //                 justifyContent: "flex-end",
        //                 color: "#7C828A",
        //                 fontFamily: "var(--font-jetBrain-mono)",
        //                 fontWeight: 500,
        //                 fontSize: 18,
        //             }}
        //         >
        //             {formatNumber(user.yapSocial)}
        //         </Box>

        //         <Box
        //             sx={{
        //                 px: 2,
        //                 display: "flex",
        //                 justifyContent: "flex-end",
        //                 color: "#003EC7",
        //                 fontFamily: "var(--font-jetBrain-mono)",
        //                 fontWeight: 500,
        //                 fontSize: 18,
        //             }}
        //         >
        //             {user.streak}
        //         </Box>

        //         <Box
        //             sx={{
        //                 px: 2,
        //                 display: "flex",
        //                 justifyContent: "flex-end",
        //                 color: "#003EC7",
        //                 fontWeight: 700,
        //                 fontSize: 18,
        //                 fontFamily: "var(--font-jetBrain-mono)",
        //             }}
        //         >
        //             {formatNumber(user.totalPoints)}
        //         </Box>
        //     </Box>
        // </Box>
    );
}
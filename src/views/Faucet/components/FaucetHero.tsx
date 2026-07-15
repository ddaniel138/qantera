import { Box, Typography } from "@mui/material";

export default function FaucetHero() {
    return (
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 400,
                    mb: 1,
                    fontSize: { xs: "32px", md: "52px" },
                    color: "#0A0B0D",
                }}
            >
                Testnet Faucet
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: "#5E5E61",
                    fontSize: "16px",
                }}
            >
                Claim test tokens to explore applications and interact with the network.
            </Typography>
        </Box>
    );
}

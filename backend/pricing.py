import numpy as np
from scipy.stats import norm
from typing import Literal, Dict

class PricingEngine:
    @staticmethod
    def black_scholes(
        S: float,  # Spot price
        K: float,  # Strike price
        T: float,  # Time to maturity (years)
        r: float,  # Risk-free rate
        sigma: float,  # Volatility
        option_type: Literal["call", "put"] = "call"
    ) -> Dict[str, float]:
        """
        Calculate Black-Scholes premium and Greeks.
        """
        # Handle expiration
        if T <= 0:
            return {
                "premium": max(0, S - K) if option_type == "call" else max(0, K - S),
                "delta": 0.0,
                "gamma": 0.0,
                "theta": 0.0,
                "vega": 0.0,
                "rho": 0.0
            }

        d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
        d2 = d1 - sigma * np.sqrt(T)

        if option_type == "call":
            premium = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
            delta = norm.cdf(d1)
            rho = K * T * np.exp(-r * T) * norm.cdf(d2)
            theta = (-S * norm.pdf(d1) * sigma / (2 * np.sqrt(T)) 
                     - r * K * np.exp(-r * T) * norm.cdf(d2))
        else:
            premium = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
            delta = norm.cdf(d1) - 1
            rho = -K * T * np.exp(-r * T) * norm.cdf(-d2)
            theta = (-S * norm.pdf(d1) * sigma / (2 * np.sqrt(T)) 
                     + r * K * np.exp(-r * T) * norm.cdf(-d2))

        gamma = norm.pdf(d1) / (S * sigma * np.sqrt(T))
        vega = S * np.sqrt(T) * norm.pdf(d1)

        return {
            "premium": float(premium),
            "delta": float(delta),
            "gamma": float(gamma),
            "theta": float(theta),
            "vega": float(vega),
            "rho": float(rho)
        }

    @staticmethod
    def garman_kohlhagen(
        S: float, K: float, T: float, 
        rd: float, # Domestic rate
        rf: float, # Foreign rate
        sigma: float, option_type: str = "call"
    ) -> Dict[str, float]:
        """
        Garman-Kohlhagen for FX Options.
        """
        if T <= 0:
            val = max(0, S-K) if option_type == "call" else max(0, K-S)
            return {"premium": val, "delta": 0, "gamma": 0, "vega": 0}

        d1 = (np.log(S / K) + (rd - rf + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
        d2 = d1 - sigma * np.sqrt(T)
        
        # Discount factors
        df_d = np.exp(-rd * T)
        df_f = np.exp(-rf * T)

        if option_type == "call":
            premium = S * df_f * norm.cdf(d1) - K * df_d * norm.cdf(d2)
            delta = df_f * norm.cdf(d1)
        else:
            premium = K * df_d * norm.cdf(-d2) - S * df_f * norm.cdf(-d1)
            delta = df_f * (norm.cdf(d1) - 1)
        
        gamma = df_f * norm.pdf(d1) / (S * sigma * np.sqrt(T))
        vega = S * df_f * np.sqrt(T) * norm.pdf(d1)

        return {
            "premium": float(premium),
            "delta": float(delta),
            "gamma": float(gamma),
            "vega": float(vega)
        }

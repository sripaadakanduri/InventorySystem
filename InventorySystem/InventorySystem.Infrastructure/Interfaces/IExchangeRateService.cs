using System;
using System.Collections.Generic;
using System.Text;

namespace InventorySystem.Service.Interfaces
{
    public interface IExchangeRateService
    {
        Task<Dictionary<String, Decimal>> GetLatestRatesAsync();
    }
}

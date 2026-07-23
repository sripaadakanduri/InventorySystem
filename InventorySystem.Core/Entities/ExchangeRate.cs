using System;
using System.ComponentModel.DataAnnotations;

namespace InventorySystem.Core.Entities
{
    public class ExchangeRate
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(3)]
        public string CurrencyCode { get; set; } = string.Empty;

        [Required]
        public decimal Rate { get; set; }
    }
}

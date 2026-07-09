public class DuplicateProductException : Exception
{
    public string ProductName { get; }
    public string Category { get; }

    public DuplicateProductException(string productName, string category)
        : base($"Product already exists")
    {
        ProductName = productName;
        Category = category;
    }
}
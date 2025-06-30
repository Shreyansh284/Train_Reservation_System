namespace Core.Options;

public class ConnectionString
{
    public const string SectionName="ConnectionString";
    public string  DefaultConnection { get; set; } = string.Empty;
}
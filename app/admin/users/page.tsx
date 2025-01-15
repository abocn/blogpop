import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import strings from "@/strings.json"

export default function Users() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.usersHeader}</h1>
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-primary">{strings.totalUsersCardTitle}</CardTitle>
              <span className="text-4xl font-bold text-primary ml-2">
                {/* TODO: Implement user logic and counter */}
                57
              </span>
            </div>
          </CardHeader>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardDescription>
                  <CardTitle className="text-xl text-primary">{strings.totalUsersLoggedInMonthCardTitle}</CardTitle>
                  <p className="text-sm italic text-muted-foreground mt-1">{strings.totalUsersLoggedInMonthCardDescription}</p>
              </CardDescription>
              <span className="text-4xl font-bold text-primary ml-2">
                {/* TODO: Implement users logged in (by month) logic + counter */}
                24
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

